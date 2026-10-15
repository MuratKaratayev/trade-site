import localFont from 'next/font/local';

// Шрифты брендбука — локальные копии (assets/fonts/, см. README там): сборка не ходит в Google Fonts.
// Вариативные файлы: один файл на семейство вместо файла на каждый вес и набор символов.
export const unbounded = localFont({
  src: '../assets/fonts/Unbounded-500-600.woff2',
  weight: '500 600',
  display: 'swap',
  variable: '--font-unbounded',
  // В Unbounded нет казахских букв (ә ғ қ ң ө ұ ү һ): без подменного шрифта с метриками Arial они берутся
  // из следующего в списке --font-display — Onest того же веса (app/globals.css), а не из системного шрифта.
  adjustFontFallback: false,
});
export const onest = localFont({
  src: '../assets/fonts/Onest-400-600.woff2',
  weight: '400 600',
  display: 'swap',
  variable: '--font-onest',
});
export const fontVars = `${unbounded.variable} ${onest.variable}`;
