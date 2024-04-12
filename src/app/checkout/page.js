'use client'
import CartContext from '@/context/cart';
import { checkout } from '@/services/api/order';
import { getProducts } from '@/services/api/product.api';
import TextField from '@mui/material/TextField'
import localforage from 'localforage';
import { useContext, useEffect, useState } from 'react';

const Page = () => {
    const [userForm, setUserForm] = useState({
        delivery_mode: "",
        delivery_address: "",
        delivery_city: "",
        delivery_zipcode : "",
        products: []
    });
    
    const getItemFromCart = async (product) => {
        try {
            const cartItems = await localforage.getItem('cart');
            const cartItemsArr = [];
            for(let i=0; i<cartItems.length; i++) {
                cartItemsArr.push(cartItems[i].products.id );
            }
            setUserForm({ ...userForm, products: cartItemsArr });
        } catch (e) {
            console.log(e)
        }
    }
    
    useEffect (() => {
        getItemFromCart()
    },[])


    const handleChange = (e) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value });
    };
    
    const clearUserForm = (e) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value , delivery_address: '', delivery_city: '', delivery_zipcode: '' });
    }

    const submit = async (e) => {
        console.log('userform', userForm);
        e.preventDefault();
        checkout(userForm)
        .then(async (res) => {
            console.log(res)
        })
    };

    return(
        <div className="min-h-screen mx-auto flex flex-col items-center">
            <form className='w-2/5' onSubmit={(e) => submit(e)}>
                <h2 class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">Paiement</h2>

                <ul class="grid w-full gap-5 md:grid-cols-2">
                    <li>
                        <input type="radio" name="delivery_mode" id="delivery" value="delivery" checked={userForm.delivery_mode === 'delivery'} onChange={(e)=> handleChange(e)} class="hidden peer" required />
                        <label for="delivery" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-sm cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-black peer-checked:border-black peer-checked:text-black hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                            <div class="block">
                                <div class="w-full text-l font-semibold">Delivery</div>
                            </div>
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="delivery_mode" id="pick-up" value="pick-up"  checked={userForm.delivery_mode === 'pick-up'} onChange={(e)=> clearUserForm(e)} class="hidden peer"/>
                        <label for="pick-up" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-sm cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-black peer-checked:border-black peer-checked:text-black hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div class="block">
                                <div class="w-full text-l font-semibold">Pick-Up</div>
                            </div>
                        </label>
                    </li>
                </ul>
                {
                    userForm.delivery_mode === 'delivery' && (
                        <div className="form-group">
                            <TextField
                                label="Adresse"
                                id="delivery_address"
                                name="delivery_address"
                                value={userForm.delivery_address}
                                onChange={(e) => handleChange(e)}
                                variant="outlined"
                                margin="dense"
                                className='w-full'
                                isRequired={true}
                                required
                                />
                            <TextField
                                label="ville"
                                id="delivery_city"
                                name="delivery_city"
                                value={userForm.delivery_city}
                                onChange={(e) => handleChange(e)}
                                variant="outlined"
                                margin="dense"
                                className='w-full'
                                isRequired={true}
                                required
                                />
                            <TextField
                                label="code postal"
                                id="delivery_zipcode"
                                name="delivery_zipcode"
                                value={userForm.delivery_zipcode}
                                onChange={(e) => handleChange(e)}
                                variant="outlined"
                                margin="dense"
                                className='w-full'
                                isRequired={true}
                                required
                                type='number'
                            />
                        </div>
                    )
                }
                <button type='submit' class="bg-transparent hover:bg-black text-black hover:text-white py-2 px-4 border border-black hover:border-transparent ">
                    Save & Continue
                </button>
            </form>
        </div>
    )
}
export default Page;