# Шрифты сайта (локальные копии)

Шрифты лежат в проекте, чтобы сборка не зависела от загрузки с Google Fonts (2026-10-15 сборка в GitHub Actions
один раз упала на скачивании шрифтов).

| Файл | Источник | Что внутри |
| --- | --- | --- |
| `Unbounded-500-600.woff2` | `google/fonts`, `ofl/unbounded/Unbounded[wght].ttf` | вариативный, вес 500–600 |
| `Onest-400-600.woff2` | `google/fonts`, `ofl/onest/Onest[wght].ttf` | вариативный, вес 400–600 |

Символы: латиница, кириллица + расширенная кириллица (казахские буквы), знаки (U+2000–206F), стрелки, №, ₸ и т. п.
Лицензия — SIL Open Font License 1.1 (`OFL-*.txt`), встраивание и вырезка разрешены.

**В Unbounded нет казахских букв ә ғ қ ң ө ұ ү һ (и заглавных)** — ни в этой копии, ни в исходнике Google Fonts.
В заголовках они берутся из Onest (того же веса) — см. `--font-display` в `app/globals.css`.

Пересборка (fonttools ≥ 4.67, brotli):

```sh
U="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0301,U+0304,U+0308,U+0329,U+0400-052F,U+1C80-1C8A,U+2000-206F,U+20AC,U+20B4,U+20B8,U+2116,U+2122,U+2190-2199,U+2212,U+2215,U+2264-2265,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F,U+FEFF,U+FFFD"
python3 -m fontTools.varLib.instancer "Unbounded[wght].ttf" wght=500:600 -o unb.ttf
python3 -m fontTools.varLib.instancer "Onest[wght].ttf" wght=400:600 -o onest.ttf
pyftsubset unb.ttf   --unicodes="$U" --flavor=woff2 --layout-features='*' --output-file=Unbounded-500-600.woff2
pyftsubset onest.ttf --unicodes="$U" --flavor=woff2 --layout-features='*' --output-file=Onest-400-600.woff2
```
