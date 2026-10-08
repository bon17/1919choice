from pathlib import Path
import json
import os
from playwright.sync_api import sync_playwright

artifact_dir=Path(os.environ.get('TEST_ARTIFACT_DIR','/tmp/1919-full-checks'))
artifact_dir.mkdir(parents=True,exist_ok=True)
base_url=os.environ.get('TEST_BASE_URL','http://127.0.0.1:5173')
expected_release=os.environ.get('EXPECTED_RELEASE')

with sync_playwright() as p:
    chromium_path=os.environ.get('CHROMIUM_PATH')
    if not chromium_path and Path('/usr/bin/chromium').exists():chromium_path='/usr/bin/chromium'
    browser=p.chromium.launch(executable_path=chromium_path,args=['--no-sandbox'])
    errors=[]

    def shot(page,name):
        page.screenshot(path=str(artifact_dir/f'{name}.png'),full_page=True)

    def no_overflow(page):
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),page.url

    def images_loaded(page):
        assert page.evaluate('''async () => {
          const sources=[...document.querySelectorAll('img')].map(i=>i.src)
            .concat([...document.querySelectorAll('svg image')].map(i=>i.href.baseVal));
          return sources.length > 0 && (await Promise.all(sources.map(async src => {
            const image=new Image(); image.src=src;
            try {await image.decode(); return image.naturalWidth > 0;} catch {return false;}
          }))).every(Boolean);
        }''')

    def select(page,**fields):
        for name,value in fields.items():page.check(f'input[name="{name}"][value="{value}"]')

    def count(page,n):
        assert page.locator('.mast .count').inner_text()==f'{n}/7'

    def read_all(page,ids,keyboard=False):
        for index,id in enumerate(ids):
            if keyboard:
                if index==0:page.locator(f'[data-question="{id}"]').focus()
                else:page.keyboard.press('Tab')
                assert page.evaluate('document.activeElement.dataset.question')==id
                page.keyboard.press('Enter')
            else:page.click(f'[data-question="{id}"]')
            assert page.locator('.note').count()==index+1
            assert page.locator('[data-action=activity]').is_enabled()==(index==len(ids)-1)
        assert page.locator('input[type=radio]').count()==0
        images_loaded(page)
        no_overflow(page)

    def record(page,n):
        page.click('[data-action=submit]')
        assert page.locator('.complete-badge').count()==1
        count(page,n)
        no_overflow(page)

    def walk(mobile=False):
        label='mobile' if mobile else 'desktop'
        context=browser.new_context(viewport={'width':390,'height':844} if mobile else {'width':1440,'height':1000})
        page=context.new_page()
        page.on('pageerror',lambda err:errors.append(str(err)))
        page.goto(base_url)
        if expected_release:assert page.locator('meta[name=game-release]').get_attribute('content')==expected_release
        assert '일곱 사람' in page.locator('.description').inner_text()
        images_loaded(page)
        no_overflow(page)
        shot(page,f'{label}-intro')
        page.click('[data-action=start]')
        assert page.locator('.main-panel').get_attribute('data-scene')=='woman'
        assert page.locator('[data-visit="1"]').is_disabled()
        assert '나라의 대표를 뽑는 데 참여할 수 없어요' in page.locator('blockquote').inner_text()
        assert page.locator('[data-action=activity]').is_disabled()
        page.click('[data-question=work]')
        page.click('[data-question=work]')
        assert page.locator('.note').count()==1
        page.locator('[data-action=activity]').evaluate("el => el.dispatchEvent(new MouseEvent('click',{bubbles:true}))")
        assert page.locator('input[type=radio]').count()==0
        page.click('[data-question=vote]')
        page.reload()
        assert page.locator('.note').count()==2
        assert page.locator('[data-action=activity]').is_disabled()
        page.click('[data-question=priority]')
        assert page.locator('[data-action=activity]').is_enabled()
        images_loaded(page)
        shot(page,f'{label}-woman-interview')
        page.click('[data-action=activity]')
        if not mobile:
            page.click('[data-action=submit]')
            assert '함께 골라' in page.locator('#feedback').inner_text()
            select(page,demand='jobs',evidence='vote')
            page.click('[data-action=submit]')
            assert page.locator('input[name=demand][value=jobs]').is_checked()
            assert page.locator('.complete-badge').count()==0
            select(page,evidence='work')
            record(page,1)
            assert page.locator('.complete-title').inner_text()=='여성의 일자리 유지'
            page.click('[data-action=revise]')
            select(page,demand='support')
            record(page,1)
            assert page.locator('.complete-title').inner_text()=='생활 지원 확대'
            page.click('[data-action=revise]')
            select(page,demand='vote',evidence='priority')
            record(page,1)
            assert page.locator('.complete-title').inner_text()=='여성의 정치 참여 확대'
            page.click('[data-action=revise]')
        select(page,demand='jobs' if not mobile else 'support',evidence='work')
        record(page,1)
        page.reload()
        count(page,1)
        page.click('.main-panel [data-action=map]')
        assert page.locator('.map-card').get_attribute('data-area')=='economic'
        assert page.locator('.map-card h4').inner_text()==('생활 지원' if mobile else '일자리 유지')
        page.keyboard.press('Escape')
        assert page.locator('dialog').count()==0
        page.click('[data-action=next]')

        # Pankhurst: all three source cards, including the delayed 1928 change.
        assert page.locator('.main-panel').get_attribute('data-scene')=='pankhurst'
        assert '1903년' in page.locator('.scene-background').inner_text()
        read_all(page,['letter','arrest','timeline'],keyboard=not mobile)
        assert '1918' in page.locator('.timeline').inner_text()
        assert '1928' in page.locator('.timeline').inner_text()
        assert '훗날' in page.locator('.timeline').inner_text()
        shot(page,f'{label}-pankhurst-sources')
        page.click('[data-action=activity]')
        if not mobile:
            select(page,demand='vote',action='movement',impact='all1918')
            page.click('[data-action=submit]')
            assert '1918년에는' in page.locator('#feedback').inner_text()
            count(page,1)
        select(page,demand='vote',action='movement',impact='gradual')
        record(page,2)
        assert '여러 운동가' in page.locator('.learning-note').inner_text()
        page.click('[data-action=next]')

        # Two citizens: two voices, one comparison activity.
        assert page.locator('.main-panel').get_attribute('data-scene')=='citizens'
        read_all(page,['citizen','german','constitution'])
        assert '20세 이상 남녀' in page.locator('blockquote').inner_text()
        page.click('[data-action=activity]')
        if not mobile:
            select(page,system='limited',reason='participation')
            page.click('[data-action=submit]')
            assert '재산 기준' in page.locator('#feedback').inner_text()
            count(page,2)
        select(page,system='broad',reason='equal' if mobile else 'participation')
        record(page,4)
        assert page.locator('.earned-card').count()==2
        shot(page,f'{label}-citizens-result')
        page.reload()
        count(page,4)
        page.click('[data-action=next]')

        # The Russia callback requires no game account or previous completion.
        assert page.locator('.main-panel').get_attribute('data-scene')=='peasant'
        assert page.locator('.previous-game a').get_attribute('href')=='https://bon17.github.io/russia-1917-game/'
        read_all(page,['land'])
        page.click('[data-action=activity]')
        select(page,demand='land',evidence='land')
        record(page,5)
        page.click('.main-panel [data-action=map]')
        assert page.locator('.map-concept').nth(1).inner_text()=='???'
        page.keyboard.press('Escape')
        page.click('[data-action=next]')

        # Factory: partial help is acknowledged; two ownership proposals pass.
        assert page.locator('.main-panel').get_attribute('data-scene')=='factory'
        read_all(page,['wages','ownership','influence'])
        page.click('[data-action=activity]')
        if not mobile:
            select(page,proposal='pay',evidence='wages')
            page.click('[data-action=submit]')
            assert '제게 필요해요' in page.locator('#feedback').inner_text()
            count(page,5)
            page.click('[data-action=hint]')
            assert '함께 볼 단서' in page.locator('#feedback').inner_text()
        select(page,proposal='public' if mobile else 'coop',evidence='ownership')
        record(page,6)
        assert '사회 전체의 이익' in page.locator('.socialism').inner_text()
        assert '러시아 혁명 이전' in page.locator('.socialism').inner_text()
        shot(page,f'{label}-factory-result')
        page.click('[data-action=next]')

        # Compose two proposals with their own evidence, allowing alternatives.
        assert page.locator('.main-panel').get_attribute('data-scene')=='young'
        read_all(page,['political','economic'])
        page.click('[data-action=activity]')
        assert page.locator('input[name=political]').count()==3
        assert page.locator('input[name=economic]').count()>=4
        if not mobile:
            select(page,political='universal',economic='land',politicalEvidence='political',economicEvidence='economic')
            page.click('[data-action=submit]')
            assert '저는 지금 공장' in page.locator('#feedback').inner_text()
            count(page,6)
            select(page,economic='sharing',politicalEvidence='economic')
            page.click('[data-action=submit]')
            assert '근거를 살펴봐도' in page.locator('#feedback').inner_text()
            assert page.locator('input[name=political][value=universal]').is_checked()
            select(page,politicalEvidence='political')
        else:
            select(page,political='suffrage',economic='safe',politicalEvidence='political',economicEvidence='economic')
        shot(page,f'{label}-young-proposal')
        record(page,7)
        page.reload()
        count(page,7)
        page.click('[data-action=next]')
        assert page.locator('.discovery-lead').count()==1
        assert '서로 반대의 답이 아닙니다' in page.locator('.discovery-lead').inner_text()
        no_overflow(page)
        shot(page,f'{label}-discovery')
        page.click('[data-action=ending]')
        assert page.locator('.ending').count()==1
        assert '1917년 러시아' in page.locator('.ending-columns').inner_text()
        assert '반드시 하나만' in page.locator('.discussion').inner_text()
        page.reload()
        assert page.locator('.ending').count()==1
        shot(page,f'{label}-ending')
        no_overflow(page)
        page.click('.ending [data-action=map]')
        assert page.locator('.map-card').count()==8
        ids=page.locator('.map-card').evaluate_all('cards => cards.map(card=>card.dataset.cardId)')
        assert len(set(ids))==7
        assert ids.count('young')==2
        assert page.locator('.map-concept').all_inner_texts()==['민주주의의 확산','사회주의의 확산']
        page.locator('.map-card[data-card-id=pankhurst] summary').click()
        assert '선거법 개정안에 여성을 포함' in page.locator('.map-card[data-card-id=pankhurst] .card-detail').inner_text()
        assert '1928년' in page.locator('.map-card[data-card-id=pankhurst] .card-detail').inner_text()
        page.keyboard.press('Tab')
        assert page.evaluate("document.querySelector('dialog').contains(document.activeElement)")
        no_overflow(page)
        shot(page,f'{label}-map')
        page.keyboard.press('Escape')
        page.click('[data-action=sources]')
        assert '1928년' in page.locator('.source-list').inner_text()
        page.click('dialog [data-action=close]')
        page.click('[data-action=reset]')
        page.click('dialog [data-action=close]')
        count(page,7)
        if not mobile:
            # Replay a completed scene: unchanged totals and a preserved final proposal.
            page.click('[data-action=review]')
            page.click('[data-visit="5"]')
            assert page.locator('.main-panel').get_attribute('data-scene')=='young'
            page.click('[data-action=revise]')
            select(page,political='representatives',economic='living',politicalEvidence='political',economicEvidence='economic')
            record(page,7)
            page.click('[data-action=next]')
            assert '국민이 대표를 선출' in page.locator('.own-proposal').inner_text()
            page.click('[data-action=ending]')
            page.click('[data-action=home]')
            page.click('[data-action=start]')
            assert page.locator('.ending').count()==1
        page.click('[data-action=reset]')
        page.click('[data-action=confirm-reset]')
        assert page.locator('.intro').count()==1
        count(page,0)
        assert '@BONSSAM 보은쌤과 함께하는 역사 수업' in page.locator('footer').inner_text()
        context.close()
        print(f'PASS: {label} full six-scene playthrough, seven unique voices, proposal, ending, map, images, persistence and reset',flush=True)

    walk()
    walk(mobile=True)
    legacy=browser.new_context()
    old={'version':2,'screen':'complete','heard':['work','vote','priority'],'active':'work','demand':'jobs','evidence':'work','completed':True}
    legacy.add_init_script("localStorage.setItem('1919-prototype-v1',"+json.dumps(json.dumps(old))+')')
    page=legacy.new_page()
    page.goto(base_url)
    assert page.locator('.complete-title').inner_text()=='여성의 일자리 유지'
    page.click('[data-action=next]')
    assert page.locator('.main-panel').get_attribute('data-scene')=='pankhurst'
    legacy.close()
    blocked=browser.new_context()
    blocked.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})")
    page=blocked.new_page()
    page.goto(base_url)
    assert '저장할 수 없어요' in page.locator('.storage').inner_text()
    page.click('[data-action=start]')
    page.click('[data-question=work]')
    assert page.locator('.note').count()==1
    assert page.locator('[data-action=activity]').is_disabled()
    blocked.close()
    assert not errors,errors
    print('PASS: legacy prototype migration and blocked storage; no browser errors',flush=True)
    browser.close()
