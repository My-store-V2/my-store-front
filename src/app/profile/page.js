"use client";
import * as React from 'react'
import Button from '@mui/material/Button'
import MailIcon from '@mui/icons-material/Mail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductsCounter from "@/components/products/ProductsCounter";
import { useState, useEffect } from 'react';
import Alert from "@/components/UI/Alert";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { getWishList, getProduct } from "@/services/api/product.api.js";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Page(){

    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                let wishlist = await getWishList();
                if (wishlist.success) {
                    const finalList = await Promise.all(wishlist.results.map(async (item) => {
                        const product = await getProduct(item.id_product);
                        return {
                            ...product.results,
                            isFavorite: true // Assuming details is an object returned from the service call
                        };
                    }));
                    setProducts(finalList)
                }
            } catch (err) {
                console.log(err)
            }

        }
            fetchProduct();
    }, []);

    useEffect(() => {
        const user =  localStorage.getItem('currentUser')
        if(user){
            setUser(JSON.parse(user))
        }
    }, [])

    useEffect(() => {
        const handleSmoothScroll = () => {
            if(window.location.hash === '#wishlist'){
                let element = document.querySelector('#wishlist')
                element.scrollIntoView({
                    behavior: 'smooth',
                });
            }
            
        };

        handleSmoothScroll();
     }, []);

    return (
        <div>
            {user && (<div className='container flex flex-row items-center justify-between mx-auto'>
                <div className='py-8 flex flex-col'>
                    <span className='text-2xl font-semibold mb-2'>{user?.firstname} {user?.lastname}</span>
                    <div className='flex flex-row'>
                        <LocationOnIcon fontSize="small" />
                        <span className='ml-1 text-sm'>{user?.address}, {user.zipcode} {user?.city}</span>
                    </div>
                    <div className='flex flex-row'>
                        <MailIcon fontSize="small" />
                        <span className='ml-1 text-sm'>{user?.email}</span>
                    </div>
                </div>
                <div onClick={handleOpen} className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white">
                    Edit profile
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                    </Box>
                </Modal>
            </div>)}
            <div id="wishlist" className="bg-slate-100 min-h-screen">
                <div className='container mx-auto flex flex-col'>
                    <span className='text-3xl font-semibold mt-12 mb-8 text-start'>My wishlist</span>
                    {
                        !products && (
                            <Alert message="No products found" type="error" />
                        )
                    }
                    {
                        products && (<div>
                            <ProductsCounter productsLength={products?.length} />
                            <ProductsGrid products={products} />
                            
                        </div>)
                    }
                    
                </div>
            </div>
        </div>
    );
}
