# Исходники логотипа

- `upscale-837x132.png` — апскейл старого логотипа от владельца (2026-10-13), источник замеров.
- `mark_layers.py` — делит знак на 3 штриха (связные области «не-белого»), сглаживает, пишет `mark_{0,1,2}.pbm`.
- `potrace mark_N.pbm -s -o mark_N.svg --turdsize 400 --alphamax 1.33 --opttolerance 1.2` — векторизация знака.
- `build_logo.py` — собирает `logo.svg`, `logo-mark.svg`, `logo-ondark.svg`:
  - знак — из `mark_*.svg`;
  - надпись — геометрией по замерам (наклон 10,25°, штрих 3,95);
  - функция `crescent()` и `params2.json` — отвергнутый вариант знака из эллипсов, не используется.
- PNG рендерились через Chromium (Playwright) из SVG.

Порядок: `python3 mark_layers.py` → potrace ×3 → `python3 build_logo.py` (нужны Pillow, numpy, potrace).
