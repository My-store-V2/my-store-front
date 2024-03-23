
'use client';
import TitlePage from "@/components/UI/TitlePage";
import ProductsCounter from "@/components/products/ProductsCounter";
import Image from 'next/image';
import paypal from '../../../public/paypal.svg'
import stripe from '../../../public/stripe.svg'
import mastercard from '../../../public/mastercard.svg'
import visa from '../../../public/visa.svg'
import { getProducts } from "@/services/api/product.api.js";
import { useState, useEffect } from 'react';
import ProductCartCard from "@/components/products/ProductCartCard";
export default function Page() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productsList = await getProducts(8);
                if (productsList.success) {
                    setProducts(productsList.results)
                }
            } catch (err) {
                console.log(err)
            }

        }
            fetchProduct();
    }, []);
    return (
        <div className="container mx-auto">
            <TitlePage title="Shopping cart" />
            <ProductsCounter productsLength={products.length} />
            <div className="min-h-screen flex flex-row py-4">
                <div className="w-full mr-14 flex flex-col">
                    <div className="flex flex-row w-full">
                        <div className="basis-5/12">Product details</div>
                        <div className="basis-1/6">Quantity</div>
                        <div className="basis-1/6">Price</div>
                        <div className="basis-1/4">Total</div>
                    </div>
                    {products.map(product => (
                        <ProductCartCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="border border-slate-300 w-96 h-fit p-3">
                    <span className="text-lg font-semibold">Order summary</span>
                    <div className="py-3">
                        <div className="flex justify-between mb-1">
                            <span className="text-slate-500">Subtotal</span>
                            <span>320 €</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="text-slate-500">Tax</span>
                            <span>3 €</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Total</span>
                            <span>323 €</span>
                        </div>
                    </div>
                    <div className="cursor-pointer w-full transition ease-in-out delay-150 mt-4 inline-flex flex justify-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white">
                        CHECKOUT
                    </div>
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
            </div>
        </div>
    )
}