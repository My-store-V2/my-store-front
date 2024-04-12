
'use client';
import TitlePage from "@/components/UI/TitlePage";
import ProductsCounter from "@/components/products/ProductsCounter";
import Image from 'next/image';
import paypal from '../../../public/paypal.svg'
import stripe from '../../../public/stripe.svg'
import mastercard from '../../../public/mastercard.svg'
import visa from '../../../public/visa.svg'
import { useState, useEffect, useContext } from 'react';
import ProductCartCard from "@/components/products/ProductCartCard";
import CartContext from '../../context/cart';
import empty from '../../../public/empty.svg';
import CircularProgress from '@mui/material/CircularProgress';
import Link from "next/link";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { checkToken } from "@/services/api/auth.api";


export default function Page() {
    const { cartItems } = useContext(CartContext);
    const [items, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const taxRate = 0.02;

    useEffect(() => {
        const calculateTotal = () => {
            let totalPrice = 0;
            if(cartItems){
                cartItems.forEach(item => {
                    totalPrice += item.products.price * item.quantity;
                });
                setTotal(totalPrice);
            }
        };

        calculateTotal();
    }, [cartItems]);

    const calculateTax = () => {
        return total * taxRate;
    };


    const handleDelete = (product) => {
        setCartItems(items.filter(item => item.id !== product.id));
    };

    const router = useRouter();

    const redirectToCheckout = () => {
        checkToken()
        .then((res) => {
            console.log('res',res);
            if(res.success == true) {
                router.push('/checkout');
            } else if(res.error == 403 || res.error == 401) {
                router.push('/login');
            }
        })
        .catch((err) => {
            console.error(err)
        });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setCartItems(cartItems)
            } catch (err) {
                console.log(err)
            }

        }
            fetchProducts();
    }, []);
    return (
        <div className="container mx-auto">
            <TitlePage title="Shopping cart" />
            {cartItems === null && (
                <div className="min-h-screen flex flex-row py-4">
                    <CircularProgress />
                </div>
            )}
            {cartItems && cartItems.length > 0 && (
                <><ProductsCounter productsLength={cartItems.length} /><div className="min-h-screen flex flex-row py-4">
                        <div className="w-full mr-14 flex flex-col">
                            <div className="flex flex-row w-full">
                                <div className="basis-5/12">Product details</div>
                                <div className="basis-1/6">Quantity</div>
                                <div className="basis-1/6">Price</div>
                                <div className="basis-1/4">Total</div>
                            </div>
                            {cartItems.map(product => (
                                <ProductCartCard key={product.id} product={product} onDelete={handleDelete} />
                            ))}
                        </div>
                        <div className="border border-slate-300 w-96 h-fit p-3">
                            <span className="text-lg font-semibold">Order summary</span>
                            <div className="py-3">
                                <div className="flex justify-between mb-1">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span>{total} €</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-slate-500">Tax ({(taxRate * 100).toFixed(2)}%)</span>
                                    <span>{calculateTax().toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Total</span>
                                    <span>{(total + calculateTax()).toFixed(2)} €</span>
                                </div>
                            </div>

                            <button className="cursor-pointer w-full transition ease-in-out delay-150 mt-4 inline-flex justify-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white" onClick={()=> redirectToCheckout()}>
                            CHECKOUT
                            </button>


                            <div className="mt-3">
                                <span className="font-semibold">We accept</span>
                            </div>
                            <div className="flex flex-row justify-between mb-3">
                                <Image src={paypal} alt="paypal" width={60}></Image>
                                <Image src={stripe} alt="stripe" width={40}></Image>
                                <Image src={mastercard} alt="mastercard" width={40}></Image>
                                <Image src={visa} alt="visa" width={40}></Image>
                            </div>
                        </div>
                    </div></>
            )}
            {cartItems && cartItems.length === 0 && (
                <Image className="mx-auto my-5" src={empty} alt="empty" width={300} height={400}></Image>
            )}
        </div>
    )
}