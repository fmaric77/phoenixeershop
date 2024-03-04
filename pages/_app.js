// pages/_app.js
import '../styles/Home.css';
import { UserProvider } from '../UserContext';


import { ProductProvider } from '../ProductContext';
import { CartProvider } from '@/CartContext';

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
        <ProductProvider>
            <CartProvider>
            <Component {...pageProps} />
                </CartProvider>
        </ProductProvider>
        </UserProvider>

    );
}

export default MyApp;