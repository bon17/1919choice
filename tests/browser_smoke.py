from pathlib import Path
import json
import os
from playwright.sync_api import sync_playwright

artifact_dir=Path(os.environ.get('TEST_ARTIFACT_DIR','/tmp/1919-revision-checks'))
artifact_dir.mkdir(parents=True,exist_ok=True)
base_url=os.environ.get('TEST_BASE_URL','http://127.0.0.1:5173')
expected_release=os.environ.get('EXPECTED_RELEASE')
clues={
 'work':'가족의 생활비','vote':'대표를 뽑을 권리는 없어요','priority':'정치에 여성도 참여',
 'letter':'보통 선거법에 여성을 포함','arrest':'편지와 집회·시위','timeline':'재산 등의 조건을 갖춘 30세 이상 여성',
 'citizen':'재산이 적은 사람','german':'국민으로부터 나오는 권력','land':'땅은 일부 지주가 가지고',
 'wages':'임금과 노동시간, 안전하게 일할 환경','ownership':'공장을 소유하고 운영하는 방식','influence':'러시아 혁명 이전부터',
 'political':'대표를 뽑는 데 참여','economic':'덜 가난하고 안전하게 살고'}
forms={
 'woman':{'demand':'jobs','evidence':'work'},'pankhurst':{'demand':'vote','action':'movement','impact':'gradual'},
 'citizens':{'system':'broad','reason':'participation'},'peasant':{'demand':'land','evidence':'land'},
 'factory':{'proposal':'coop','evidence':'ownership'},
 'young':{'political':'universal','politicalEvidence':'political','economic':'sharing','economicEvidence':'economic'}}

with sync_playwright() as p:
    chromium_path=os.environ.get('CHROMIUM_PATH')
    if not chromium_path and Path('/usr/bin/chromium').exists():chromium_path='/usr/bin/chromium'
    browser=p.chromium.launch(executable_path=chromium_path,args=['--no-sandbox'])
    errors=[]

    def shot(page,name):
        page.evaluate("async()=>{await Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})))}")
        page.screenshot(path=str(artifact_dir/f'{name}.png'),full_page=True)
    def no_overflow(page):assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),page.url
    def count(page,n):assert page.locator('.mast .count').inner_text()==f'{n}/7'
    def phase(page,name):assert page.locator('.main-panel').get_attribute('data-phase')==name
    def saved(page):return page.evaluate("JSON.parse(localStorage.getItem('1919-prototype-v1'))")
    def art_full(page):
        assert page.evaluate('''async () => {
          const arts=[...document.querySelectorAll('.artwork')];
          if(!arts.length)return false;
          return (await Promise.all(arts.map(async el=>{
            let source,ratio;
            if(el.tagName==='IMG'){source=el.src;ratio=1.5;}
            else{source=el.querySelector('image').href.baseVal;ratio=1;
              if(el.getAttribute('preserveAspectRatio')!=='xMidYMid meet')return false;}
            const img=new Image();img.src=source;await img.decode();
            const style=getComputedStyle(el),box={width:parseFloat(style.width),height:parseFloat(style.height)};
            return img.naturalWidth>0 && Math.abs(box.width/box.height-ratio)<.02 && getComputedStyle(el).objectFit!=='cover';
          }))).every(Boolean);
        }''')
        no_overflow(page)

    def enter(page,scene):
        assert page.locator('.main-panel').get_attribute('data-scene')==scene
        phase(page,'background')
        assert '이 사람을 만나기 전에' in page.locator('#screen-title').inner_text()
        assert page.locator('.story-tabs').count()==0
        assert page.locator('fieldset').count()==0
        assert page.locator('.character-frame .artwork').count()==1
        art_full(page)
        if scene=='pankhurst':
            assert '1903년' in page.locator('.background-copy').inner_text()
            assert '요구 → 활동 → 변화' not in page.locator('.main-panel').inner_text()
        if scene=='citizens':assert '재산이 적다는 이유' in page.locator('.background-copy').inner_text()
        if scene=='peasant':assert page.locator('.previous-game a').get_attribute('href')=='https://bon17.github.io/russia-1917-game/'
        page.click('[data-action=listen]')
        phase(page,'explore')

    def read(page,ids,label,keyboard=False):
        # Opening every tab alone must not unlock the activity.
        for id in ids:page.click(f'[data-question="{id}"]')
        assert page.locator('[data-action=activity]').is_disabled()
        assert page.locator('.note').count()==0
        # A unrelated phrase yields guidance and stays in the scene.
        first=ids[0];page.click(f'[data-question="{first}"]')
        wrong=page.locator(f'[data-clue="{first}"]').filter(has_not_text=clues[first]).first
        wrong.click()
        assert '다시 확인' in page.locator('#feedback').inner_text()
        assert page.locator('.note').count()==0
        for index,id in enumerate(ids):
            button=page.locator(f'[data-question="{id}"]')
            if keyboard:
                button.focus();page.keyboard.press('Enter')
                assert page.evaluate("document.activeElement.id")=='voice-panel'
            else:button.click()
            art_full(page)
            if id=='german':
                assert page.locator('.speaker-name').inner_text()=='독일 시민'
                assert '독일의 투표소' in page.locator('.character-frame svg').get_attribute('aria-label')
                assert '헌법' not in page.locator('.speech').inner_text()
                shot(page,f'{label}-german-speaker')
            if id=='letter':
                assert '동아 역사1 교과서 187쪽' in page.locator('.source-citation').inner_text()
                shot(page,f'{label}-pankhurst-letter')
            if id=='timeline':
                assert '훗날' in page.locator('.timeline').inner_text()
                assert '남녀 모두 21세 이상' in page.locator('.timeline').inner_text()
            page.click(f'[data-clue="{id}"][data-value="{clues[id]}"]')
            assert page.locator('.note').count()==index+1
            assert page.locator('.speech mark').inner_text()==clues[id]
            phase(page,'explore') # No auto-advance, including the last of three questions.
            if index==0 and label=='desktop':
                page.reload()
                assert page.locator('.note').count()==1
            assert page.locator('input[type=radio]').count()==0
        assert page.locator('[data-action=activity]').is_enabled()
        shot(page,f'{label}-{ids[0]}-clues')
        page.click('[data-action=activity]')
        phase(page,'activity')

    def fill(page,form,submit=True):
        for index,(name,value) in enumerate(form.items()):
            assert page.locator('fieldset').count()==1 # One decision per screen.
            page.check(f'input[name="{name}"][value="{value}"]')
            no_overflow(page)
            if index<len(form)-1:page.click('[data-action=next-step]')
        if submit:page.click('[data-action=submit]')

    def recorded(page,n):
        phase(page,'result');assert page.locator('.complete-badge').count()==1;count(page,n);art_full(page)

    def walk(mobile=False):
        label='mobile' if mobile else 'desktop'
        context=browser.new_context(viewport={'width':390,'height':844} if mobile else {'width':1440,'height':1000},reduced_motion='reduce' if mobile else 'no-preference')
        context.add_init_script('''window.__audioContexts=[];const Original=window.AudioContext;window.AudioContext=new Proxy(Original,{construct(target,args){const ctx=new target(...args);window.__audioContexts.push(ctx);return ctx;}});''')
        page=context.new_page();page.on('pageerror',lambda err:errors.append(str(err)))
        page.goto(base_url)
        if expected_release:assert page.locator('meta[name=game-release]').get_attribute('content')==expected_release
        assert '일곱 사람' in page.locator('.description').inner_text()
        assert '수업용 재구성 삽화' not in page.locator('body').inner_text()
        assert page.locator('[data-action=sound]').get_attribute('aria-pressed')=='false'
        art_full(page);shot(page,f'{label}-intro')
        page.click('[data-action=sound]')
        page.wait_for_function("window.__audioContexts.length===1 && window.__audioContexts[0].state==='running'")
        page.click('[data-action=sound]')
        page.wait_for_function("window.__audioContexts[0].state==='suspended'")
        assert page.locator('[data-action=sound]').get_attribute('aria-pressed')=='false'
        page.click('[data-action=start]')
        assert page.locator('[data-visit="1"]').is_disabled()
        shot(page,f'{label}-woman-background')
        enter(page,'woman')
        read(page,['work','vote','priority'],label)
        if not mobile:
            fill(page,{'demand':'jobs','evidence':'vote'})
            assert '고른 요구는 그대로' in page.locator('#feedback').inner_text()
            count(page,0);assert saved(page)['chapters']['woman']['form']['demand']=='jobs'
            page.click('[data-action=edit]')
        fill(page,{'demand':'support' if mobile else 'jobs','evidence':'work'})
        recorded(page,1)
        assert page.locator('.complete-title').inner_text()==('생활 지원' if mobile else '일자리 유지')
        if not mobile:
            for demand,evidence,title in [('support','work','생활 지원'),('vote','priority','여성 참정권'),('jobs','work','일자리 유지')]:
                page.click('[data-action=revise]');fill(page,{'demand':demand,'evidence':evidence});recorded(page,1)
                assert page.locator('.complete-title').inner_text()==title
        page.reload();recorded(page,1)
        page.click('.main-panel [data-action=map]')
        assert page.locator('.map-card').get_attribute('data-area')=='economic'
        page.keyboard.press('Escape');assert page.locator('dialog').count()==0
        page.click('[data-action=next]')

        enter(page,'pankhurst');read(page,['letter','arrest','timeline'],label,keyboard=not mobile)
        assert '공장에 취직하는 문제보다' not in page.locator('body').inner_text()
        if not mobile:
            fill(page,{'demand':'vote','action':'movement','impact':'all1918'})
            assert '1918년에는' in page.locator('#feedback').inner_text();count(page,1)
            page.click('[data-action=edit]')
        fill(page,forms['pankhurst']);recorded(page,2)
        assert '여러 운동가' in page.locator('.learning-note').inner_text()
        shot(page,f'{label}-pankhurst-result');page.click('[data-action=next]')

        enter(page,'citizens');read(page,['citizen','german'],label)
        assert page.locator('.constitution').count()==0
        if not mobile:
            fill(page,{'system':'limited','reason':'participation'})
            assert '재산 기준' in page.locator('#feedback').inner_text();count(page,2)
            page.click('[data-action=edit]')
        fill(page,{'system':'broad','reason':'equal' if mobile else 'participation'})
        phase(page,'history');count(page,2)
        assert '독일은 공화국이다. 국가 권력은 국민으로부터 나온다.' in page.locator('.constitution').inner_text()
        assert '비례 대표제의 원칙에 따라 20세 이상 남녀의 보통 선거' in page.locator('.constitution').inner_text()
        assert '동아 역사1 교과서 187쪽' in page.locator('.source-citation').inner_text()
        assert page.locator('[data-action=confirm-record]').is_disabled()
        page.click('[data-clue=power][data-value="국민으로부터"][data-history]')
        assert page.locator('[data-action=confirm-record]').is_disabled()
        page.reload();phase(page,'history')
        page.click('[data-clue=voters][data-value="20세 이상 남녀"][data-history]')
        shot(page,f'{label}-constitution');page.click('[data-action=confirm-record]');recorded(page,4)
        assert page.locator('.earned-card').count()==2
        page.click('[data-action=next]')

        enter(page,'peasant');read(page,['land'],label);fill(page,forms['peasant']);recorded(page,5)
        page.click('.main-panel [data-action=map]');assert page.locator('.map-concept').nth(1).inner_text()=='???'
        page.keyboard.press('Escape');page.click('[data-action=next]')

        enter(page,'factory');read(page,['wages','ownership','influence'],label)
        if not mobile:
            fill(page,{'proposal':'pay','evidence':'wages'})
            assert '제게 필요해요' in page.locator('#feedback').inner_text();count(page,5)
            page.click('[data-action=hint]');assert '함께 볼 단서' in page.locator('#feedback').inner_text()
            page.click('[data-action=edit]')
        fill(page,{'proposal':'public' if mobile else 'coop','evidence':'ownership'});recorded(page,6)
        assert '사회 전체의 이익' in page.locator('.socialism').inner_text()
        assert '러시아 혁명 이전' in page.locator('.socialism').inner_text()
        shot(page,f'{label}-factory-result');page.click('[data-action=next]')

        enter(page,'young');read(page,['political','economic'],label)
        assert page.locator('input[name=political]').count()==3
        if not mobile:
            fill(page,{**forms['young'],'economic':'land'})
            assert '저는 지금 공장' in page.locator('#feedback').inner_text();count(page,6)
            page.click('[data-action=edit]')
            fill(page,{**forms['young'],'politicalEvidence':'economic'})
            assert '근거를 살펴봐도' in page.locator('#feedback').inner_text()
            assert saved(page)['chapters']['young']['form']['political']=='universal'
            page.click('[data-action=edit]')
        form=forms['young'] if not mobile else {'political':'suffrage','politicalEvidence':'political','economic':'safe','economicEvidence':'economic'}
        fill(page,form,submit=False)
        assert page.locator('.proposal-pair .economic').inner_text()
        shot(page,f'{label}-two-proposals');page.click('[data-action=submit]');recorded(page,7)
        if mobile:assert page.locator('.complete-badge').evaluate("el=>getComputedStyle(el).animationName")=='none'
        page.reload();recorded(page,7);page.click('[data-action=next]')
        assert '서로 반대의 답이 아닙니다' in page.locator('.discovery-lead').inner_text()
        no_overflow(page);shot(page,f'{label}-discovery');page.click('[data-action=ending]')
        assert '반드시 하나만' in page.locator('.discussion').inner_text()
        assert '1917년 러시아' in page.locator('.ending-columns').inner_text()
        page.reload();shot(page,f'{label}-ending');no_overflow(page)
        full=saved(page)
        page.click('.ending [data-action=map]')
        ids=page.locator('.map-card').evaluate_all('cards=>cards.map(c=>c.dataset.cardId)')
        assert len(ids)==8 and len(set(ids))==7 and ids.count('young')==2
        assert page.locator('.map-concept').all_inner_texts()==['민주주의의 확산','사회주의의 확산']
        page.locator('.map-card[data-card-id=pankhurst] summary').click()
        assert '1928' in page.locator('.map-card[data-card-id=pankhurst]').inner_text()
        page.keyboard.press('Tab');assert page.evaluate("document.querySelector('dialog').contains(document.activeElement)")
        no_overflow(page);shot(page,f'{label}-map');page.keyboard.press('Escape')
        page.click('[data-action=sources]')
        assert '동아 역사1 교과서' in page.locator('.source-list').inner_text()
        assert 'AI로 만든 수업용 재구성 삽화' in page.locator('.source-list').inner_text()
        assert '사용자 제공 교과서' not in page.locator('.source-list').inner_text()
        page.click('dialog [data-action=close]')
        page.click('[data-action=reset]');page.click('dialog [data-action=close]');count(page,7)
        if not mobile:
            page.click('[data-action=review]');page.click('[data-visit="5"]');page.click('[data-action=revise]')
            fill(page,{'political':'representatives','politicalEvidence':'political','economic':'living','economicEvidence':'economic'})
            recorded(page,7);page.click('[data-action=next]')
            assert '국민이 대표를 선출' in page.locator('.own-proposal').inner_text()
            page.click('[data-action=ending]');page.click('[data-action=home]');page.click('[data-action=start]')
            assert page.locator('.ending').count()==1
        page.click('[data-action=reset]');page.click('[data-action=confirm-reset]')
        assert page.locator('.intro').count()==1;count(page,0)
        assert '@BONSSAM 보은쌤과 함께하는 역사 수업' in page.locator('footer').inner_text()
        context.close()
        print(f'PASS: {label}: staged full game, real clues, uncropped pictures, constitution order, alternatives, sound, ending, map and restore',flush=True)
        return full

    full=walk();walk(mobile=True)
    for version in [2,3]:
        legacy=browser.new_context()
        old={'version':2,'screen':'complete','heard':['work','vote','priority'],'active':'work','demand':'jobs','evidence':'work','completed':True}
        if version==3:
            old=json.loads(json.dumps(full));old['version']=3
            for c in old['chapters'].values():
                c.pop('clues',None);c.pop('history',None);c.pop('step',None)
            old['chapters']['citizens']['heard'].append('constitution')
        legacy.add_init_script("localStorage.setItem('1919-prototype-v1',"+json.dumps(json.dumps(old))+')')
        page=legacy.new_page();page.on('pageerror',lambda err:errors.append(str(err)));page.goto(base_url)
        if version==2:
            assert page.locator('.complete-title').inner_text()=='일자리 유지'
            page.click('[data-action=next]');enter(page,'pankhurst')
        else:
            count(page,7);assert page.locator('.ending').count()==1
        legacy.close()
    blocked=browser.new_context()
    blocked.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})")
    page=blocked.new_page();page.on('pageerror',lambda err:errors.append(str(err)));page.goto(base_url)
    assert '저장할 수 없어요' in page.locator('.storage').inner_text()
    page.click('[data-action=start]');page.click('[data-action=listen]');page.click('[data-clue=work][data-value="가족의 생활비"]')
    assert page.locator('.note').count()==1;assert page.locator('[data-action=next-item]').is_enabled()
    blocked.close();assert not errors,errors
    print('PASS: v2/v3 migration, reduced motion, blocked storage, no browser errors',flush=True)
    browser.close()
