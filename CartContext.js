import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]); // Declare cart state here

    const addToCart = (product) => {
        if (product) {
            setCart((prevCart) => {
                const updatedCart = [...prevCart, product];
                return updatedCart;
            });
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};