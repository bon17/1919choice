from pathlib import Path
from playwright.sync_api import sync_playwright
Path("/tmp/1919-checks").mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000})
 errors=[]
 page.on('pageerror',lambda err:errors.append(str(err)))
 page.goto('http://127.0.0.1:5173')
 page.screenshot(path='/tmp/1919-checks/intro.png',full_page=True)
 page.click('[data-action=start]')
 page.click('[data-question=work]')
 page.click('[data-action=report]')
 page.click('[data-action=submit]')
 assert '더 들어볼' in page.locator('#feedback').inner_text()
 page.click('[data-action=interview]')
 page.click('[data-question=vote]')
 page.click('[data-question=priority]')
 page.reload()
 assert page.locator('.note').count()==3
 page.click('[data-action=report]')
 page.check('input[name=demand][value=jobs]')
 page.check('input[name=evidence][value=work]')
 page.click('[data-action=submit]')
 assert '우선순위' in page.locator('#feedback').inner_text()
 page.check('input[name=demand][value=vote]')
 page.click('[data-action=submit]')
 assert '서로 다른' in page.locator('#feedback').inner_text()
 page.screenshot(path='/tmp/1919-checks/report.png',full_page=True)
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
 page.screenshot(path='/tmp/1919-checks/mobile.png',full_page=True)
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.click('[data-action=reset]')
 page.click('[data-action=cancel-reset]')
 assert page.locator('.complete-badge').count()==1
 page.click('[data-action=reset]')
 page.click('[data-action=confirm-reset]')
 assert page.locator('.intro').count()==1
 blocked=browser.new_page()
 blocked.add_init_script("Object.defineProperty(window, 'localStorage', {get(){throw new Error('blocked')}})")
 blocked.goto('http://127.0.0.1:5173')
 assert '저장할 수 없어요' in blocked.locator('.storage').inner_text()
 blocked.click('[data-action=start]')
 blocked.click('[data-question=vote]')
 assert blocked.locator('.note').count()==1
 blocked.close()
 assert not errors,errors
 print('PASS: interview, hints, evidence mismatch, completion, persistence, map, reset, mobile overflow; no browser errors')
 browser.close()
