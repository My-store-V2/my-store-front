'use client';
import Link from 'next/link';
import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useState } from 'react';
import SelectableChip from '@/components/products/SelectableChip'
import { removeItemFromCart } from '../../../utils/cart';

const Index = ({ product, onDelete }) => {
    const [quantity, setQuantity] = useState(product.quantity);
    const [selectedChip, setSelectedChip] = useState(product.size);
    const chips = [
        { id: 1, label: 'XS' },
        { id: 2, label: 'S' },
        { id: 3, label: 'M' },
        { id: 4, label: 'L' },
        { id: 5, label: 'XL' }
    ];

    const handleSelectChip = (chipId) => {
        setSelectedChip(chipId);
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        await removeItemFromCart(itemId);
        onDelete(itemId)
    };

    return (
        <div className="flex flex-row w-full py-5 border-b border-slate-400">
            <div className="flex flex-row w-full items-center">
                <div className="basis-5/12 flex flex-row">
                    <Link className="mr-4 group/thumbnail thumbnail" href={`/shop/${product.id}`}>
                        <div className="overflow-hidden w-fill w-[90px] h-[100px] relative">
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
                    <div className="flex flex-col">
                        <h2 className="text-md mb-2 text-lg">{product.name}</h2>
                        <div className="flex flex-wrap gap-1">
                            {chips.map(chip => (
                                <SelectableChip
                                    key={chip.id}
                                    label={chip.label}
                                    isSelected={chip.id === selectedChip}
                                    onSelect={() => handleSelectChip(chip.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center basis-1/6">
                    <div className="border">
                        <button className="p-2" onClick={decreaseQuantity}>-</button>
                        <input
                            className="focus:outline-none text-center border-0 w-10"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            min="1"
                            readOnly
                        />
                        <button className="p-2" onClick={increaseQuantity}>+</button>
                    </div>
                </div>
                <div className="basis-1/6">
                    <p className="font-semibold font-s">{product.price} €</p>
                </div>
                <div className="basis-1/4 flex flex-row justify-between items-center">
                    <p className="font-semibold font-sm">{product.price * quantity} €</p>
                    <IconButton aria-label="delete" onClick={() => handleRemoveFromCart(product.id)}>
                        <DeleteOutlineIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

export default Index;
