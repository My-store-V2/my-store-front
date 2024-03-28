'use client';
import Link from "next/link";
import { getProducts, getWishList } from "@/services/api/product.api.js";
import Alert from "@/components/UI/Alert";
import ProductsGrid from "@/components/products/ProductsGrid";
import TitlePage from "@/components/UI/TitlePage";
import { useState, useEffect } from 'react';
import ProductsCounter from "@/components/products/ProductsCounter";

export default function Page({
    searchParams,
}) {

    const [products, setProducts] = useState([]);
    const { take = 8 } = searchParams || {};


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productsList = await getProducts(take);
                const isConnected =  localStorage.getItem('currentUser') ? true : false
                if(isConnected) {
                    let wishlist = [];
                    wishlist = await getWishList();
                    if (wishlist.success) {
                        const wishlistId = wishlist.results.map((x) => x.id_product);
                        const finalList = productsList.results.map((x) => {
                            const isFavorite = x.isFavorite = wishlistId.includes(x.id)
                            const obj = x
                            obj.isFavorite = isFavorite
                            return obj
                        });

                        setProducts(finalList)
                    }
                } else{
                    if (productsList.success) {
                        setProducts(productsList.results)
                    }
                }
            } catch (err) {
                console.log(err)
            }

        }
            fetchProduct();
    }, []);

    return (
        <div className="container mx-auto">
            <TitlePage title="Shop" />
            <ProductsCounter productsLength={products.length} />
            <ProductsGrid products={products} />
            <div className="flex justify-center mb-24">
                {
                    Number(take) <= products.length && (
                        <Link
                            className="cursor-pointer transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white"
                            href={`/shop?take=${(Number(take) + 8)}`}
                        >
                            See more
                        </Link>
                    )
                }
            </div>
        </div>
    )
}
