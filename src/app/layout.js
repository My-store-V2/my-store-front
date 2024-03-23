'use client'

import Header from '@/components/partials/Header';
import Footer from '@/components/partials/Footer';
import Link from 'next/link';
import '@/assets/styles/style.scss';
import '../../public/fonts/Font.css';
import { usePathname } from 'next/navigation';
import { DM_Serif_Display, Work_Sans } from 'next/font/google';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const dm_serif_display = DM_Serif_Display({
    subsets: ['latin'],
    weight: ['400']
});

const work_sans = Work_Sans({
    subsets: ['latin'],
    weight: ['400', '700', '600', '900']
});

const theme = createTheme({
  typography: {
    fontFamily: "Work Sans",
    fontSize: 16,
  },
  palette: {
    primary: {
      main: 'rgb(100 116 139);',
    },
  },
});

export default function RootLayout({ children }) {
    const pathname = usePathname();
    let header;
    if (pathname !== "/login" && pathname !== "/register") {
      header = <Header />;
    } else {
      header =
      <header className="bg-white border-color-black py-4">
            <ul className="flex pl-6 pr-6 items-center justify-between">
                <li className="flex lg:flex-1">
                    <Link href="/">
                        <span className="font-semibold text-2xl font-bold">mystore.</span>
                    </Link>
                </li>
                <li>
                </li>
            </ul>
        </header>;
    }
    return (
        <ThemeProvider theme={theme}>
            <html lang="en">
                <body className={`${dm_serif_display.className} ${work_sans.className}`}>
                    {header}
                    <main>
                        {children}
                    </main>
                    <Footer />
                </body>
            </html>
        </ThemeProvider>
    )
}
