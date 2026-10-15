# Шрифты сайта (локальные копии)

Шрифты лежат в проекте, чтобы сборка не зависела от загрузки с Google Fonts (2026-10-15 сборка в GitHub Actions
один раз упала на скачивании шрифтов).

| Файл | Источник | Что внутри |
| --- | --- | --- |
| `Unbounded-500.woff2`, `Unbounded-600.woff2` | `google/fonts`, `ofl/unbounded/Unbounded[wght].ttf` | статичные 500 и 600 + **дорисованные казахские буквы** |
| `Onest-400-600.woff2` | `google/fonts`, `ofl/onest/Onest[wght].ttf` | вариативный, вес 400–600 + знак дюйма ″ |

Символы: латиница, кириллица + расширенная кириллица (казахские буквы), знаки (U+2000–206F), стрелки, №, ₸ и т. п.
Лицензия — SIL Open Font License 1.1 (`OFL-*.txt`), встраивание и вырезка разрешены.

**В оригинальном Unbounded нет казахских букв** Ә ә Ғ ғ Қ қ Ң ң Ө ө Ұ ұ Ү ү Һ һ (нет и в Google Fonts). Они
дорисованы скриптом `source/build_kazakh_unbounded.py` из частей самого шрифта (2026-10-15, по решению владельца):
Ә ә / Ө ө — латинские Ə ə / Ɵ ɵ; Һ һ Ү — H h Y; Қ қ Ң ң — К к Н н + хвостик из Ц ц; Ғ ғ Ұ ұ — перекладина
толщиной в перекладину Н; ү — v + штрих вниз. Кернинга у новых букв нет. Лицензия OFL изменения разрешает
(Reserved Font Name у Unbounded нет); в имени версии шрифта отмечено, что он изменён.

Пересборка (fonttools ≥ 4.67, skia-pathops, brotli; исходники — `google/fonts`, `ofl/unbounded/` и `ofl/onest/`):

```sh
python3 assets/fonts/source/build_kazakh_unbounded.py "Unbounded[wght].ttf" assets/fonts "Onest[wght].ttf"
```
