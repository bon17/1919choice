from pathlib import Path
import os
from playwright.sync_api import sync_playwright
artifact_dir=Path(os.environ.get("TEST_ARTIFACT_DIR", "/tmp/1919-checks"))
artifact_dir.mkdir(parents=True, exist_ok=True)
base_url=os.environ.get("TEST_BASE_URL", "http://127.0.0.1:5173")
with sync_playwright() as p:
 chromium_path=os.environ.get('CHROMIUM_PATH')
 if not chromium_path and Path('/usr/bin/chromium').exists():chromium_path='/usr/bin/chromium'
 browser=p.chromium.launch(executable_path=chromium_path,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000})
 errors=[]
 page.on('pageerror',lambda err:errors.append(str(err)))
 page.goto(base_url)
 expected_release=os.environ.get('EXPECTED_RELEASE')
 if expected_release:assert page.locator('meta[name=game-release]').get_attribute('content')==expected_release
 page.screenshot(path=str(artifact_dir/'intro.png'),full_page=True)
 page.click('[data-action=start]')
 assert '선거에 참여할 권리가 없습니다' in page.locator('.scene-background').inner_text()
 assert '전쟁터로 떠난 사람들을 대신해' in page.locator('blockquote').inner_text()
 assert '나라의 대표를 뽑는 데 참여할 수 없어요' in page.locator('blockquote').inner_text()
 page.click('[data-question=work]')
 page.screenshot(path=str(artifact_dir/'background.png'),full_page=True)
 page.click('[data-action=report]')
 page.click('[data-action=submit]')
 assert '함께 골라' in page.locator('#feedback').inner_text()
 page.click('[data-action=interview]')
 page.click('[data-question=vote]')
 page.click('[data-question=priority]')
 page.reload()
 assert page.locator('.note').count()==3
 page.click('[data-action=report]')
 page.check('input[name=demand][value=jobs]')
 page.check('input[name=evidence][value=work]')
 page.click('[data-action=submit]')
 assert '여성 노동자의 답변' in page.locator('#feedback').inner_text()
 assert '제 걱정을 알아주셨네요' in page.locator('#feedback').inner_text()
 assert '더 원해요' in page.locator('#feedback').inner_text()
 page.screenshot(path=str(artifact_dir/'character-response.png'),full_page=True)
 page.check('input[name=demand][value=vote]')
 page.click('[data-action=submit]')
 assert '그 말도 제 걱정을 담고 있어요' in page.locator('#feedback').inner_text()
 page.screenshot(path=str(artifact_dir/'report.png'),full_page=True)
 page.check('input[name=evidence][value=vote]')
 page.click('[data-action=submit]')
 assert page.locator('.complete-badge').count()==1
 page.reload()
 assert page.locator('.complete-badge').count()==1
 page.click('.main-panel [data-action=map]')
 assert page.locator('.map-card').count()==1
 page.keyboard.press('Escape')
 assert page.locator('dialog').count()==0
 page.set_viewport_size({'width':390,'height':844})
 page.screenshot(path=str(artifact_dir/'mobile.png'),full_page=True)
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.click('[data-action=reset]')
 page.click('[data-action=cancel-reset]')
 assert page.locator('.complete-badge').count()==1
 page.click('[data-action=reset]')
 page.click('[data-action=confirm-reset]')
 assert page.locator('.intro').count()==1
 blocked=browser.new_page()
 blocked.add_init_script("Object.defineProperty(window, 'localStorage', {get(){throw new Error('blocked')}})")
 blocked.goto(base_url)
 assert '저장할 수 없어요' in blocked.locator('.storage').inner_text()
 blocked.click('[data-action=start]')
 blocked.click('[data-question=vote]')
 assert blocked.locator('.note').count()==1
 blocked.close()
 assert not errors,errors
 print('PASS: interview, hints, evidence mismatch, completion, persistence, map, reset, mobile overflow; no browser errors')
 browser.close()
