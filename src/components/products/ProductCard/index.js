'use client';
import Link from 'next/link';
import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { addToWishList, deleteFromWishList } from "@/services/api/product.api.js";
import { useState, useEffect, useContext } from 'react';
import SelectableChip from '@/components/products/SelectableChip'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import WarningIcon from '@mui/icons-material/Warning';
import CartContext from '../../../context/cart';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    alignItems: 'center'
};

const Index = ({ product }) => {
    const [checked, setChecked] = useState(product.isFavorite || false);
    const [selectedChip, setSelectedChip] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { addItemToCart } = useContext(CartContext);
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

    const handleChange = (event) => {
        setChecked(event.target.checked);
        if(!checked) {
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

    const addToCart = async (product) => {
        if(selectedChip === null){
            setOpen(true)
        } else{
            addItemToCart(product);
        }
    }

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
                <h2 className="text-md mb-1">{product.name}</h2>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <IconButton aria-label="warning">
                            <WarningIcon color='error'/>
                        </IconButton>
                        <Typography id="modal-modal-description">
                            Please choose a size
                        </Typography>
                    </Box>
                </Modal>
                <div className="flex flex-wrap gap-1">
                    {chips.map(chip => (
                        <SelectableChip
                            key={chip.id}
                            label={chip.label}
                            onClick={handleOpen}
                            isSelected={chip.id === selectedChip}
                            onSelect={() => handleSelectChip(chip.id)}
                        />
                    ))}
                </div>
                <p className="font-semibold font-s mt-3">{product.price} €</p>
                <div className='flex flex-row justify-between'>
                    <div className="opacity-0 group-hover/card:opacity-100 transition ease-in-out delay-150">
                        <Link className="cursor-pointer transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white" href={`/shop/${product.id}`}>
                            Details
                        </Link>
                    </div>
                    <div className="cursor-pointer transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white"
                        onClick={() => addToCart(product)}>
                        Add to cart
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default Index;
