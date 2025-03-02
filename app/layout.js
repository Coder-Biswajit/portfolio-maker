import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import StoreProvider from './components/StoreProvider';
import ThemeRegistry from './components/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Portfoli - Professional Portfolio Maker',
  description: 'Create and showcase your professional portfolio with Portfoli',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <StoreProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </StoreProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
