"""
Достраивает в Unbounded казахские буквы, которых нет в шрифте (ни в Google Fonts, ни в исходнике):
Ә ә Ғ ғ Қ қ Ң ң Ө ө Ұ ұ Ү ү Һ һ, плюс знак дюйма ″.

Запуск (fonttools ≥ 4.67, skia-pathops, brotli):
    python3 assets/fonts/source/build_kazakh_unbounded.py "Unbounded[wght].ttf" assets/fonts "Onest[wght].ttf"

Как устроено:
- из вариативного исходника делаются статичные начертания 500 и 600 (на сайте используются только они);
- готовые формы берутся из самого шрифта: Ә ә = латинские Ə ə, Ө ө = Ɵ ɵ, Һ һ = H h, Ү = Y, ″ = " ;
- Қ қ Ң ң = К к Н н + хвостик, вырезанный из Ц ц (та же форма и глубина, тот же отступ от правого штриха);
- Ғ ғ = Г г + перекладина толщиной в перекладину Н, Ұ = Y + перекладина;
- ү = v + вертикальный штрих вниз до глубины хвостика ц, ұ = ү + перекладина;
- новые глифы — простые контуры без перекрытий (pathops), метрики — от базовой буквы.
Кернинга у новых букв нет (у базовых — есть).
"""

import sys
from pathlib import Path

import pathops
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

UNICODES = (
    "U+0000-00FF,U+0131,U+0152-0153,U+018F,U+019F,U+0259,U+0275,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0301,U+0304,"
    "U+0308,U+0329,U+0400-052F,U+1C80-1C8A,U+2000-206F,U+20AC,U+20B4,U+20B8,U+2116,U+2122,U+2190-2199,U+2212,"
    "U+2215,U+2264-2265,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F,U+FEFF,U+FFFD"
)


def outline(font, name, transform=(1, 0, 0, 1, 0, 0)):
    """Контур глифа как pathops.Path (компоненты разложены)."""
    gs = font.getGlyphSet()
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    path = pathops.Path()
    rec.replay(TransformPen(path.getPen(), transform))
    return path


def rect(x0, y0, x1, y1):
    p = pathops.Path()
    pen = p.getPen()
    pen.moveTo((x0, y0))
    pen.lineTo((x0, y1))
    pen.lineTo((x1, y1))
    pen.lineTo((x1, y0))
    pen.closePath()
    return p


def union(*paths):
    builder = pathops.OpBuilder(fix_winding=True, keep_starting_points=False)
    for p in paths:
        builder.add(p, pathops.PathOp.UNION)
    return builder.resolve()


def intersect(a, b):
    return pathops.op(a, b, pathops.PathOp.INTERSECTION, fix_winding=True)


def bounds(path):
    return path.bounds  # (xMin, yMin, xMax, yMax)


def spans_at_y(path, y, width=4000):
    """Отрезки по горизонтали, где контур пересекает линию y (по тонкой полосе), слева направо."""
    band = intersect(path, rect(-width, y - 1, width, y + 1))
    return sorted((c.bounds[0], c.bounds[2]) for c in band.contours)


def spans_at_x(path, x, height=4000):
    """Отрезки по вертикали, где контур пересекает линию x, снизу вверх."""
    band = intersect(path, rect(x - 1, -height, x + 1, height))
    return sorted((c.bounds[1], c.bounds[3]) for c in band.contours)


def put_glyph(font, name, path, advance, unicode_):
    pen = TTGlyphPen(None)
    path.draw(Cu2QuPen(pen, max_err=1, reverse_direction=False))
    glyph = pen.glyph()
    font["glyf"][name] = glyph
    glyph.recalcBounds(font["glyf"])
    lsb = glyph.xMin if hasattr(glyph, "xMin") and glyph.numberOfContours else 0
    font["hmtx"][name] = (int(round(advance)), int(lsb))
    if name not in font.getGlyphOrder():
        font.setGlyphOrder(font.getGlyphOrder() + [name])
        font["glyf"].glyphOrder = font.getGlyphOrder()
    if unicode_ is not None:
        for table in font["cmap"].tables:
            if table.isUnicode():
                table.cmap[unicode_] = name


def copy_glyph(font, src, name, unicode_):
    adv = font["hmtx"][src][0]
    put_glyph(font, name, outline(font, src), adv, unicode_)


def build(src_path, weight):
    font = instancer.instantiateVariableFont(TTFont(src_path), {"wght": weight})
    cmap = font.getBestCmap()
    g = lambda cp: cmap[cp]
    adv = lambda name: font["hmtx"][name][0]

    # --- готовые формы ---
    copy_glyph(font, g(0x018F), "uni04D8", 0x04D8)  # Ә ← Ə
    copy_glyph(font, g(0x0259), "uni04D9", 0x04D9)  # ә ← ə
    copy_glyph(font, g(0x019F), "uni04E8", 0x04E8)  # Ө ← Ɵ
    copy_glyph(font, g(0x0275), "uni04E9", 0x04E9)  # ө ← ɵ
    copy_glyph(font, g(0x0048), "uni04BA", 0x04BA)  # Һ ← H
    copy_glyph(font, g(0x0068), "uni04BB", 0x04BB)  # һ ← h
    copy_glyph(font, g(0x0059), "uni04AE", 0x04AE)  # Ү ← Y
    copy_glyph(font, g(0x0022), "uni2033", 0x2033)  # ″ ← "

    # --- замеры ---
    H, n = outline(font, g(0x041D)), outline(font, g(0x043D))  # Н н
    cap, xh = font["OS/2"].sCapHeight, font["OS/2"].sxHeight
    # перекладина Н: по вертикали в середине глифа
    hb = bounds(H)
    bar_cap = [s for s in spans_at_x(H, (hb[0] + hb[2]) / 2) if 0 < s[0] < cap]
    bar_cap = bar_cap[0]  # (y0, y1)
    nb = bounds(n)
    bar_x = [s for s in spans_at_x(n, (nb[0] + nb[2]) / 2) if 0 < s[0] < xh][0]
    # толщина вертикального штриха (левый штрих Н и н)
    # ниже перекладины (на половине высоты у Н она перекрывает штрихи)
    stem_cap = spans_at_y(H, cap * 0.25)[0]
    stem_x = spans_at_y(n, xh * 0.25)[0]
    stem_cap_w = stem_cap[1] - stem_cap[0]
    stem_x_w = stem_x[1] - stem_x[0]

    def tail_of(name, overlap=None):
        """Хвостик Ц/ц: часть ниже базовой линии + правый край правого штриха над ней."""
        p = outline(font, name)
        h = cap if name == g(0x0426) else xh
        right_stem_inner, right_stem_outer = spans_at_y(p, h * 0.25)[-1]
        # Только правая часть: от внутреннего края правого штриха, с захлёстом вверх на штрих (без шва),
        # иначе захватывается нижняя планка Ц и между ножками остаётся волосяная линия
        top = (right_stem_outer - right_stem_inner) * 0.5 if overlap is None else overlap
        tail = intersect(p, rect(right_stem_inner, -2000, 4000, top))
        tb = bounds(tail)
        return tail, tb, right_stem_outer, adv(name) - bounds(p)[2]

    def with_tail(base_cp, tail_src_cp, name, cp, align="stem"):
        base = outline(font, g(base_cp))
        bb = bounds(base)
        # у К нога косая: захлёст на штрих дал бы выступ — только 2 единицы против шва
        tail, tb, tail_ref, rsb = tail_of(g(tail_src_cp), None if align == "stem" else 2)
        h = cap if base_cp < 0x0430 else xh
        if align == "stem":  # Ң ң: хвостик от правого штриха, как у Ц
            ref = spans_at_y(base, h * 0.25)[-1][1]
        else:  # Қ қ: под концом нижней ноги — правый край буквы
            ref = bb[2]
        dx = ref - tail_ref
        moved = pathops.Path()
        tail.draw(TransformPen(moved.getPen(), (1, 0, 0, 1, dx, 0)))
        glyph = union(base, moved)
        new_adv = max(adv(g(base_cp)), bounds(glyph)[2] + rsb)
        put_glyph(font, name, glyph, new_adv, cp)

    with_tail(0x041D, 0x0426, "uni04A2", 0x04A2)  # Ң
    with_tail(0x043D, 0x0446, "uni04A3", 0x04A3)  # ң
    with_tail(0x041A, 0x0426, "uni049A", 0x049A, align="edge")  # Қ
    with_tail(0x043A, 0x0446, "uni049B", 0x049B, align="edge")  # қ

    # Ғ ғ: перекладина через вертикальный штрих Г/г, на высоте перекладины Н/н
    def with_bar(base_cp, name, cp, bar, stem_w, left_ext=0.55, right_ext=1.6):
        base = outline(font, g(base_cp))
        h = cap if base_cp < 0x0430 else xh
        s0, s1 = spans_at_y(base, h * 0.25)[0]
        b = rect(s0 - left_ext * stem_w, bar[0], s1 + right_ext * stem_w, bar[1])
        put_glyph(font, name, union(base, b), adv(g(base_cp)), cp)

    with_bar(0x0413, "uni0492", 0x0492, bar_cap, stem_cap_w)  # Ғ
    with_bar(0x0433, "uni0493", 0x0493, bar_x, stem_x_w)  # ғ

    # ү: v + штрих вниз (глубина как у хвостика ц), ұ = ү + перекладина
    v = outline(font, g(0x0076))
    vb = bounds(v)
    cx = (vb[0] + vb[2]) / 2
    desc = bounds(intersect(outline(font, g(0x0446)), rect(-4000, -2000, 4000, 2)))[1]
    ue = union(v, rect(cx - stem_x_w / 2, desc, cx + stem_x_w / 2, stem_x_w))
    put_glyph(font, "uni04AF", ue, adv(g(0x0076)), 0x04AF)  # ү
    bar_h = bar_x[1] - bar_x[0]
    yb = desc * 0.5
    ub = union(ue, rect(cx - 1.4 * stem_x_w, yb - bar_h / 2, cx + 1.4 * stem_x_w, yb + bar_h / 2))
    put_glyph(font, "uni04B1", ub, adv(g(0x0076)), 0x04B1)  # ұ

    # Ұ: Y + перекладина на нижней трети ножки
    Y = outline(font, g(0x0059))
    Yb = bounds(Y)
    ys = spans_at_y(Y, cap * 0.2)
    sx0, sx1 = ys[0]
    yc = cap * 0.27
    bh = bar_cap[1] - bar_cap[0]
    put_glyph(font, "uni04B0", union(Y, rect(sx0 - 1.1 * stem_cap_w, yc - bh / 2, sx1 + 1.1 * stem_cap_w, yc + bh / 2)), adv(g(0x0059)), 0x04B0)

    # Имя — помечаем как изменённую версию (OFL без Reserved Font Name, но так честнее)
    for rec in font["name"].names:
        if rec.nameID == 5:
            rec.string = rec.toUnicode() + "; Kazakh glyphs added for trade-engeeniring.kz"
    return font


def main():
    src, out_dir = sys.argv[1], Path(sys.argv[2])
    if len(sys.argv) > 3:  # третьим аргументом — исходник Onest[wght].ttf
        build_onest(sys.argv[3], out_dir)
    for w in (500, 600):
        font = build(src, w)
        tmp = out_dir / f"_unbounded-{w}.ttf"
        font.save(tmp)
        opts = Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]
        f = TTFont(tmp)
        sub = Subsetter(opts)
        from fontTools.subset import parse_unicodes

        sub.populate(unicodes=parse_unicodes(UNICODES))
        sub.subset(f)
        f.flavor = "woff2"
        f.save(out_dir / f"Unbounded-{w}.woff2")
        tmp.unlink()
        print("ok", w)



def build_onest(src_path, out_dir):
    """Onest (основной текст): вариативный 400–600 + знак дюйма ″ (в шрифте его нет) как составной из \"."""
    from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphComponent
    from fontTools.subset import parse_unicodes

    font = instancer.instantiateVariableFont(TTFont(src_path), {"wght": (400, 600)})
    src = font.getBestCmap()[0x0022]
    comp = GlyphComponent()
    comp.glyphName, comp.x, comp.y, comp.flags = src, 0, 0, 0x4  # ROUND_XY_TO_GRID
    glyph = Glyph()
    glyph.numberOfContours = -1
    glyph.components = [comp]
    font["glyf"]["uni2033"] = glyph
    font["hmtx"]["uni2033"] = font["hmtx"][src]
    # glyf[...] = … сам добавляет имя в порядок глифов (это тот же список, что у шрифта)
    if "gvar" in font:
        # составной глиф без собственных вариаций: 4 фантомные точки без смещений
        font["gvar"].variations["uni2033"] = []
    if "HVAR" in font:  # вариации ширины — как у кавычки
        hv = font["HVAR"].table
        for m in (hv.AdvWidthMap, hv.LsbMap, hv.RsbMap):
            if m is not None:
                m.mapping["uni2033"] = m.mapping[src]
    for table in font["cmap"].tables:
        if table.isUnicode():
            table.cmap[0x2033] = "uni2033"
    glyph.recalcBounds(font["glyf"])
    tmp = Path(out_dir) / "_onest.ttf"
    font.save(tmp)
    font = TTFont(tmp)
    opts = Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    sub = Subsetter(opts)
    sub.populate(unicodes=parse_unicodes(UNICODES + ",U+2033"))
    sub.subset(font)
    font.flavor = "woff2"
    font.save(Path(out_dir) / "Onest-400-600.woff2")
    tmp.unlink()
    print("ok onest")


if __name__ == "__main__":
    main()
