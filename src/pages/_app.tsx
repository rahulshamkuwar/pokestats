import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Roboto } from '@next/font/google';

const roboto = Roboto({
  weight: "400",
  subsets: ['latin'],
  variable: '--font-roboto',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${roboto.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}
