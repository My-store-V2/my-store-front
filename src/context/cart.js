import React, { createContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { getCartList, addToCartList, deleteFromCartList } from '../services/api/cart.api';


const CART_KEY = 'cart';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const currentUser = localStorage.getItem('currentUser');
                setIsConnected(!!currentUser);
                let items = [];
                if(isConnected){
                    items = await getCartList()
                    if(items){
                        items = items.cart
                    }
                } else {
                    const storedCartItems = await localforage.getItem(CART_KEY);
                    if (storedCartItems) {
                        items = storedCartItems;
                    }
                }
                setCartItems(items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [isConnected]);

    const addItemToCart = async (item) => {
        try {
            let updatedCartItems = [...cartItems];
            if (isConnected) {
                const data = {
                "product_id": item.products.id,
                "quantity": 1
                }
                // Call API to add item to cart if user is authenticated
                await addToCartList(data);
                // Fetch updated cart items from API
                updatedCartItems = await getCartList()
                if(updatedCartItems){
                    updatedCartItems = updatedCartItems.cart
                }
            } else {
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
            }
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const removeItemFromCart = async (product) => {
        try {
            let updatedCartItems = [];
            if (isConnected) {
                const data = {
                "product_id": product.products.id,
                "quantity": product.quantity
                }
                // Call API to delete item to cart if user is authenticated
                await deleteFromCartList(data);
                // Fetch updated cart items from API
                updatedCartItems = await getCartList()
                if(updatedCartItems){
                    updatedCartItems = updatedCartItems.cart
                }
            } else {
                const itemId = product.id
                 const items = cartItems.filter(item => item.id !== itemId);
                 updatedCartItems = items
                 await localforage.setItem(CART_KEY, items);
            }
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const updateItemSize = async (itemId, size) => {
        try {
            let updatedCartItems = [...cartItems];
            updatedCartItems = cartItems.map(item => {
                    if (item.id === itemId) {
                        return { ...item, size: size };
                    }
                    return item;
                });
            await localforage.setItem(CART_KEY, updatedCartItems);
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error updating item size:', error);
        }
    }

    const updateItemQuantity = async (product) => {
        try {
            let updatedCartItems = [...cartItems];
            if (isConnected) {
                // Call API to delete item to cart if user is authenticated
                await deleteFromCartList({
                "product_id": product.product_id,
                "quantity": product.quantity
                });
                // Fetch updated cart items from API
                updatedCartItems = await getCartList()
                if(updatedCartItems){
                    updatedCartItems = updatedCartItems.cart
                }
            } else {
                const itemId = product.id
                updatedCartItems = cartItems.map(item => {
                    if (item.id === itemId) {
                        return { ...item, quantity: product.quantity };
                    }
                    return item;
                });
                await localforage.setItem(CART_KEY, updatedCartItems);
            }
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, isConnected, updateItemSize, setIsConnected, addItemToCart, removeItemFromCart, updateItemQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
