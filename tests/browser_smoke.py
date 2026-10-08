from pathlib import Path
import os
from playwright.sync_api import sync_playwright

artifact_dir = Path(os.environ.get('TEST_ARTIFACT_DIR', '/tmp/1919-checks'))
artifact_dir.mkdir(parents=True, exist_ok=True)
base_url = os.environ.get('TEST_BASE_URL', 'http://127.0.0.1:5173')

with sync_playwright() as p:
    chromium_path = os.environ.get('CHROMIUM_PATH')
    if not chromium_path and Path('/usr/bin/chromium').exists():
        chromium_path = '/usr/bin/chromium'
    browser = p.chromium.launch(executable_path=chromium_path, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    errors = []
    page.on('pageerror', lambda err: errors.append(str(err)))
    page.goto(base_url)
    expected_release = os.environ.get('EXPECTED_RELEASE')
    if expected_release:
        assert page.locator('meta[name=game-release]').get_attribute('content') == expected_release
    assert '여성 노동자 한 장면' in page.locator('.small').first.inner_text()
    assert page.locator('.intro-art img').evaluate('img => img.complete && img.naturalWidth > 0')
    assert '@BONSSAM 보은쌤과 함께하는 역사 수업' in page.locator('footer').inner_text()
    page.screenshot(path=str(artifact_dir / 'intro.png'), full_page=True)

    page.click('[data-action=start]')
    assert '아직 없는 선거 참여 권리' in page.locator('.scene-background').inner_text()
    assert '전쟁터로 떠난 사람들을 대신해' in page.locator('blockquote').inner_text()
    assert '나라의 대표를 뽑는 데 참여할 수 없어요' in page.locator('blockquote').inner_text()
    assert page.locator('.scene-art img').evaluate('img => img.complete && img.naturalWidth > 0')
    assert page.locator('[data-action=report]').is_disabled()
    page.click('[data-question=work]')
    assert page.locator('[data-action=report]').is_disabled()
    assert '1/3' in page.locator('#interview-progress').inner_text()
    page.locator('[data-action=report]').evaluate("el => el.dispatchEvent(new MouseEvent('click', {bubbles: true}))")
    assert page.locator('input[name=demand]').count() == 0
    page.click('[data-question=work]')
    assert page.locator('.note').count() == 1
    page.screenshot(path=str(artifact_dir / 'background.png'), full_page=True)
    page.click('[data-question=vote]')
    assert page.locator('[data-action=report]').is_disabled()
    page.reload()
    assert page.locator('.note').count() == 2
    assert page.locator('[data-action=report]').is_disabled()
    page.click('[data-question=priority]')
    assert page.locator('[data-action=report]').is_enabled()
    assert page.locator('input[name=demand]').count() == 0
    page.click('[data-action=report]')
    assert '당신이 주목한 요구' in page.locator('.task').inner_text()
    page.click('[data-action=submit]')
    assert '함께 골라' in page.locator('#feedback').inner_text()
    page.click('[data-action=interview]')
    page.reload()
    assert page.locator('.note').count() == 3
    page.click('[data-action=report]')

    # An unrelated statement prompts another look without changing the demand.
    page.check('input[name=demand][value=jobs]')
    page.check('input[name=evidence][value=vote]')
    page.click('[data-action=submit]')
    assert '여성 노동자의 답변' in page.locator('#feedback').inner_text()
    assert page.locator('input[name=demand][value=jobs]').is_checked()
    assert page.locator('.complete-badge').count() == 0
    page.screenshot(path=str(artifact_dir / 'character-response.png'), full_page=True)
    page.check('input[name=evidence][value=work]')
    page.click('[data-action=submit]')
    assert page.locator('.complete-title').inner_text() == '여성의 일자리 유지'
    assert '여성 참정권' not in page.locator('.concept').inner_text()
    page.reload()
    assert page.locator('.complete-title').inner_text() == '여성의 일자리 유지'
    page.click('.main-panel [data-action=map]')
    assert page.locator('.map-card').count() == 1
    assert page.locator('.map-card').get_attribute('data-area') == 'economic'
    assert page.locator('.map-card h4').inner_text() == '일자리 유지'
    assert '여성 참정권' not in page.locator('dialog').inner_text()
    page.screenshot(path=str(artifact_dir / 'jobs-map.png'), full_page=True)
    page.keyboard.press('Escape')
    assert page.locator('dialog').count() == 0

    # Revising the record preserves the interview and replaces the chosen card.
    page.click('[data-action=revise]')
    assert page.locator('.note').count() == 3
    page.check('input[name=demand][value=support]')
    page.click('[data-action=submit]')
    assert page.locator('.complete-title').inner_text() == '생활 지원 확대'
    page.click('.main-panel [data-action=map]')
    assert page.locator('.map-card h4').inner_text() == '생활 지원'
    assert page.locator('.map-card').get_attribute('data-area') == 'economic'
    page.keyboard.press('Escape')
    page.click('[data-action=revise]')
    page.check('input[name=demand][value=vote]')
    page.click('[data-action=submit]')
    assert '정치에 참여하고 싶은 마음' in page.locator('#feedback').inner_text()
    assert page.locator('input[name=demand][value=vote]').is_checked()
    page.screenshot(path=str(artifact_dir / 'report.png'), full_page=True)
    page.check('input[name=evidence][value=vote]')
    page.click('[data-action=submit]')
    assert page.locator('.complete-title').inner_text() == '여성의 정치 참여 확대'
    page.reload()
    assert page.locator('.complete-badge').count() == 1
    page.click('.main-panel [data-action=map]')
    assert page.locator('.map-card').count() == 1
    assert page.locator('.map-card h4').inner_text() == '여성 참정권'
    assert page.locator('.map-card').get_attribute('data-area') == 'political'
    page.keyboard.press('Escape')

    page.set_viewport_size({'width': 390, 'height': 844})
    page.screenshot(path=str(artifact_dir / 'mobile-result.png'), full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.click('[data-action=revise]')
    page.screenshot(path=str(artifact_dir / 'mobile-report.png'), full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.click('[data-action=submit]')
    page.click('[data-action=reset]')
    page.click('[data-action=cancel-reset]')
    assert page.locator('.complete-badge').count() == 1
    page.click('[data-action=reset]')
    page.click('[data-action=confirm-reset]')
    assert page.locator('.intro').count() == 1
    page.screenshot(path=str(artifact_dir / 'mobile-intro.png'), full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.click('[data-action=start]')
    page.screenshot(path=str(artifact_dir / 'mobile-interview.png'), full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')

    blocked = browser.new_page()
    blocked.add_init_script("Object.defineProperty(window, 'localStorage', {get(){throw new Error('blocked')}})")
    blocked.goto(base_url)
    assert '저장할 수 없어요' in blocked.locator('.storage').inner_text()
    blocked.click('[data-action=start]')
    blocked.click('[data-question=vote]')
    assert blocked.locator('.note').count() == 1
    assert blocked.locator('[data-action=report]').is_disabled()
    blocked.close()
    assert not errors, errors
    print('PASS: three-story gate, all three demand branches, matching evidence, dynamic map, images, persistence, reset, mobile; no browser errors')
    browser.close()
