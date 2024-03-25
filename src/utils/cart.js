// utils/cart.js
import localforage from 'localforage';

const CART_KEY = 'cart';

export const addItemToCart = async (item) => {
    try {
        const cartItems = await getCartItems();
        const updatedCart = [...cartItems, item];
        await localforage.setItem(CART_KEY, updatedCart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
};

export const removeItemFromCart = async (itemId) => {
    try {
        const cartItems = await getCartItems();
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        await localforage.setItem(CART_KEY, updatedCart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
};

export const getCartItems = async () => {
    try {
        const cartItems = await localforage.getItem(CART_KEY);
        return cartItems || [];
    } catch (error) {
        console.error('Error getting cart items:', error);
        return [];
    }
};

export const setCartItems = async (items) => {
    try {
        await localforage.setItem(CART_KEY, items);
    } catch (error) {
        console.error('Error setting cart items:', error);
    }
};
