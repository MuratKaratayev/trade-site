import localFont from 'next/font/local';

// Шрифты брендбука — локальные копии (assets/fonts/, см. README там): сборка не ходит в Google Fonts.
// В Unbounded дорисованы казахские буквы, которых нет в оригинале (ә ғ қ ң ө ұ ү һ и заглавные) —
// скрипт assets/fonts/source/build_kazakh_unbounded.py. Начертания 500 и 600 — отдельные статичные файлы.
export const unbounded = localFont({
  src: [
    { path: '../assets/fonts/Unbounded-500.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/Unbounded-600.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-unbounded',
});
export const onest = localFont({
  src: '../assets/fonts/Onest-400-600.woff2',
  weight: '400 600',
  display: 'swap',
  variable: '--font-onest',
});
export const fontVars = `${unbounded.variable} ${onest.variable}`;
