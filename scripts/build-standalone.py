from pathlib import Path
root = Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text()
css = (root / 'style.css').read_text()
game = (root / 'game.js').read_text().replace('export ', '')
app = (root / 'app.js').read_text()
app = app[app.index('\n') + 1:]
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
html = html.replace('<script type="module" src="app.js"></script>', '<script type="module">' + game + '\n' + app + '</script>')
(root / 'play.html').write_text(html)
print('Built play.html: no external files or server required')
