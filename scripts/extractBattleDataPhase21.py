from pathlib import Path

APP = Path('src/App07.jsx')
OUT = Path('src/cardData.js')
IMPORT_LINE = 'import {C,starter,mythic,supports,opponents,lines,attackFlavor} from "./cardData.js";'

text = APP.read_text(encoding='utf-8')

if 'from "./cardData.js"' in text:
    raise SystemExit('App07.jsx already imports cardData.js; refusing to re-extract.')

start = text.find('const C={')
end = text.find('function shuffle', start)
if start < 0 or end < 0:
    raise SystemExit(f'Could not locate card-data region: start={start}, end={end}')

region = text[start:end]
required = ['const C={', 'const starter=', 'const mythic=', 'const supports=', 'const opponents=', 'const lines=', 'const attackFlavor=']
missing = [needle for needle in required if needle not in region]
if missing:
    raise SystemExit(f'Missing expected declarations: {missing}')

exports = [
    ('const C={', 'export const C={'),
    ('const starter=', 'export const starter='),
    ('const mythic=', 'export const mythic='),
    ('const supports=', 'export const supports='),
    ('const opponents=', 'export const opponents='),
    ('const lines=', 'export const lines='),
    ('const attackFlavor=', 'export const attackFlavor='),
]
card_data = region
for old, new in exports:
    if card_data.count(old) != 1:
        raise SystemExit(f'Expected exactly one declaration anchor: {old}')
    card_data = card_data.replace(old, new, 1)

OUT.write_text(
    '// Phase 2.1: static card, Support, opponent, and flavor data extracted from App07.\n'
    + card_data,
    encoding='utf-8'
)

patched = text[:start] + IMPORT_LINE + '\n\n' + text[end:]
APP.write_text(patched, encoding='utf-8')
print(f'Extracted battle data region to {OUT} and patched {APP}.')
