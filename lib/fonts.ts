import { Onest, Unbounded } from 'next/font/google';

// cyrillic-ext — казахские буквы (ә, ғ, қ, ң, ө, ұ, ү, һ, і); без него казахский текст рисовался бы запасным шрифтом.
export const unbounded = Unbounded({ subsets: ['cyrillic', 'cyrillic-ext', 'latin'], weight: ['500', '600'], display: 'swap', variable: '--font-unbounded' });
export const onest = Onest({ subsets: ['cyrillic', 'cyrillic-ext', 'latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-onest' });
export const fontVars = `${unbounded.variable} ${onest.variable}`;
