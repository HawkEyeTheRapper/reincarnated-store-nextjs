import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CartProvider } from '../context/CartContext';
import StoreLayout from '../components/layouts/StoreLayout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <StoreLayout>
        <Component {...pageProps} />
      </StoreLayout>
    </CartProvider>
  );
}
