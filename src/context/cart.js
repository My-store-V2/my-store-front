import React, { createContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const CART_KEY = 'cart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const storedCartItems = await localforage.getItem(CART_KEY);
                if (storedCartItems) {
                    setCartItems(storedCartItems);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    const addItemToCart = async (item) => {
        try {
            const updatedCartItems = [...cartItems];
            const existingItemIndex = updatedCartItems.findIndex(existingItem => existingItem.id === item.id);

            if (existingItemIndex !== -1) {
                // If item already exists in the cart, increase its quantity
                updatedCartItems[existingItemIndex].quantity += 1;
            } else {
                // If item is not in the cart, add it with quantity 1
                item.quantity = 1;
                item.id = cartItems.length;
                updatedCartItems.push(item);
            }

            await localforage.setItem(CART_KEY, updatedCartItems);
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const removeItemFromCart = async (itemId) => {
        try {
            const updatedCartItems = cartItems.filter(item => item.id !== itemId);
            await localforage.setItem(CART_KEY, updatedCartItems);
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
