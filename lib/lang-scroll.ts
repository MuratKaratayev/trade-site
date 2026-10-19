// Место на странице при смене языка: LangToggle сохраняет в sessionStorage, langScrollScript (SiteLayout) восстанавливает.
// Обе версии страницы собраны из одних компонентов: блоки совпадают по порядку, а высота — нет (тексты разной длины).
// Поэтому запоминаем не пиксели, а блок под шапкой и долю его высоты.
export const LANG_SCROLL_KEY = 'lang-scroll';
export const LANG_SCROLL_BLOCKS = '#main section,#main h1,#main h2,#main h3,#main p,#main li,footer';
