"""Build a self-contained entry point and an immutable, content-addressed edition."""
from pathlib import Path
import hashlib
import re

root = Path(__file__).resolve().parent.parent
html = (root / 'shell.html').read_text()
css = (root / 'style.css').read_text()
game = (root / 'game.js').read_text().replace('export ', '')
app = (root / 'app.js').read_text().split('\n', 1)[1]
html = re.sub(r'<link rel="stylesheet" href="style\.css(?:\?[^\"]*)?">', lambda _: '<style>' + css + '</style>', html)
html = re.sub(r'<script type="module" src="app\.js(?:\?[^\"]*)?"></script>', lambda _: '<script type="module">' + game + '\n' + app + '</script>', html)
release = hashlib.sha256(html.encode()).hexdigest()[:12]
html = html.replace('</head>', f'<meta name="game-release" content="{release}"></head>')
for name in ['index.html', 'play.html']:
    (root / name).write_text(html)
editions = root / 'editions'
editions.mkdir(exist_ok=True)
( editions / f'{release}.html').write_text(html)
print(f'Built self-contained game: editions/{release}.html')
