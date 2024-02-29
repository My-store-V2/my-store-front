'use client';
import Link from 'next/link';
import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { addToWishList, deleteFromWishList } from "@/services/api/product.api.js";
import { useState, useEffect } from 'react';


const Index = ({ product }) => {
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        if(!checked) {
            console.log(checked)
            addToWishList({id_product: product.id})
            .then((res) =>{
                console.log(res);
            }).catch((err) =>{
                console.log(err);
            })
        } else {
            deleteFromWishList(product.id)
            .then((res) =>{
                console.log(res);
            }).catch((err) =>{
                console.log(err);
            })
        }
    };

    return (
        <div className="group/card max-w-sm bg-white rounded-lg relative">
            <div className="absolute top-2 right-2 z-40 bg-white p-0.5 rounded-full">
                <Checkbox checked={checked}
                    onChange={handleChange}
                    color="default" icon={<FavoriteBorder fontSize="small" />} checkedIcon={<Favorite fontSize="small" />} />
            </div>
            <Link className="group/thumbnail thumbnail" href={`/shop/${product.id}`}>
                <div className="overflow-hidden w-fill h-[300px] relative">
                    <Image
                        className="group-hover/thumbnail:opacity-100 group-hover/thumbnail:scale-105 transition ease-in-out delay-150"
                        alt={product.name}
                        src={product.thumbnail.includes('uploads') ? '' : product.thumbnail}
                        fill
                        sizes="100%"
                        style={{ objectFit: "cover" }}
                    />
                    <Image
                        className="opacity-100 group-hover/thumbnail:scale-105 group-hover/thumbnail:opacity-0 transition ease-in-out delay-150"
                        alt={product.name}
                        src={product.packshot.includes('uploads') ? '' : product.packshot}
                        fill
                        sizes="100%"
                        style={{ objectFit: "cover" }}
                    />
                </div>
            </Link>
            <div className="py-5 px-3">
                <h2 className="text-md mb-3">{product.name}</h2>
                <p className="font-semibold font-s">{product.price} €</p>
                <div className="opacity-0 group-hover/card:opacity-100 transition ease-in-out delay-150">
                    <Link className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white" href={`/shop/${product.id}`}>
                        Voir le produit
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Index;
