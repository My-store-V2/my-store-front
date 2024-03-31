'use client'
import TextField from '@mui/material/TextField'
import { useState } from 'react';

const Page = () => {
    const [isDelivery, setIsDelivery] = useState(true);

    const [userForm, setUserForm] = useState({
        shipping_method: "",
        address: "",
    });

    const handleChange = (e) => {
        console.log("e",e)
        setUserForm({ ...userForm, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();

        console.log("userform: ",userForm);
    };

    return(
        <div className="min-h-screen mx-auto flex flex-col items-center">
            <form className='w-2/5' onSubmit={(e) => submit(e)}>
                <h2 class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">Paiement</h2>

                <ul class="grid w-full gap-5 md:grid-cols-2">
                    <li>
                        <input type="radio" name="shipping_method" id="delivery" value="delivery" checked={userForm.shipping_method === 'delivery'} onChange={(e)=> handleChange(e)} class="hidden peer" required />
                        <label for="delivery" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-sm cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-black peer-checked:border-black peer-checked:text-black hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                            <div class="block">
                                <div class="w-full text-l font-semibold">Delivery</div>
                            </div>
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="shipping_method" id="pick-up" value="pick-up"  checked={userForm.shipping_method === 'pick-up'} onChange={(e)=> handleChange(e)} class="hidden peer"/>
                        <label for="pick-up" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-sm cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-black peer-checked:border-black peer-checked:text-black hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div class="block">
                                <div class="w-full text-l font-semibold">Pick-Up</div>
                            </div>
                        </label>
                    </li>
                </ul>
                {
                    userForm.shipping_method === 'delivery' && (
                        <div className="form-group">
                            <TextField
                                label="Address"
                                id="address"
                                name="address"
                                value={userForm.address}
                                onChange={(e) => handleChange(e)}
                                variant="outlined"
                                margin="dense"
                                className='w-full'
                                isRequired={true}
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