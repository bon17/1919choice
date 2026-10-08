from pathlib import Path
import re
root = Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text()
css = (root / 'style.css').read_text()
game = (root / 'game.js').read_text().replace('export ', '')
app = (root / 'app.js').read_text()
app = app[app.index('\n') + 1:]
html = re.sub(r'<link rel="stylesheet" href="style\.css(?:\?[^"]*)?">', lambda _: '<style>' + css + '</style>', html)
html = re.sub(r'<script type="module" src="app\.js(?:\?[^"]*)?"></script>', lambda _: '<script type="module">' + game + '\n' + app + '</script>', html)
(root / 'play.html').write_text(html)
print('Built play.html: no external files or server required')
