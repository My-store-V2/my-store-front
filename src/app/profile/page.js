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
import { useState, useEffect, useContext } from 'react';
import Alert from "@/components/UI/Alert";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { getWishList, getProduct } from "@/services/api/product.api.js";

import Grid from '@mui/material/Grid';
import { getWishList, getProduct } from "@/services/api/product.api.js";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
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

//     //Modifier un ou des champs dans la base de données
//     let {data , loading, error, fetchData} = useFetch({url:`/user`,method:"PUT", body:userForm, token:token})

//     //recuperer tous les informations de id venant de la base de données
//     const {data: getUser , error: userError, loading:userLoading, fetchData:fetchDataUser } = useFetch({url:`/user`,method:"GET", body:null, token:token})

//     useEffect(() => {
//         setUserForm(user)
//     }, [user]);

//     //Si cela a bien modifié la base de données, le modal va se fermer
//   useEffect(() => {
//     if (fetchData.success) {
//       setIsOpen(false);
//       updateUser(fetchData.user)
//     }
//   }, [fetchData]);

//   //Recuperer le token
//   useEffect(() => {
//     setToken(localStorage.getItem('token'))
//   }, []);

//   //Si token existe, on peut recuprer tous les infos
//   useEffect(() => {
//     if (token != null){
//       fetchDataUser();
//     }
//   }, [token]);

//   if (loading) return <Loading />
//   if (error) console.log(error);

//   //Remplir les champs de formulaire
//   const handleChange = (e) => {
//     console.log(userForm)
//     setUserForm({ 
//       ...userForm, 
//       [e.target.name]: e.target.value 
//     })
//     if (e.target.name === "street"){
//       userForm.address.street = e.target.value
//     }
//     if (e.target.name === "zipCode"){
//       userForm.address.zipCode = e.target.value
//     }
//     if (e.target.name === "city"){
//       userForm.address.city = e.target.value
//     }
//   }

//   //Quand on clique le bouton, cela modifie le profil
//   const submitForm = (e) => {
//     e.preventDefault();
//     fetchData();
//     if (data) {
//       alert ('Votre profil a bien été modifié ! Il faut bien recharger votre page pour bien afficher les informations.');
//       setIsOpen(false);
//     }
//   }
    
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
                    <Box sx={style} >
                    <Typography id="server-modal-title" variant="h5" component="h2">
                        My profile
                    </Typography>
          
                        <form>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        id="firstname"
                                        label="Firstname"
                                        variant="outlined"
                                        margin="dense"
                                        className=''
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="lastname"
                                        className=""
                                        label="Lastname"
                                        variant="outlined"
                                        margin="dense"
                                        
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="Email"
                                        className=""
                                        label="Email"
                                        variant="outlined"
                                        margin="dense"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="phone"
                                        className=""
                                        label="Phone"
                                        variant="outlined"
                                        margin="dense"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="address"
                                        className=""
                                        label="Address"
                                        variant="outlined"
                                        margin="dense"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="zipcode"
                                        className=""
                                        label="ZipCode"
                                        variant="outlined"
                                        margin="dense"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="city"
                                        className=""
                                        label="City"
                                        variant="outlined"
                                        margin="dense"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <div onClick={handleOpen} className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white">
                                        Update profile
                                    </div>
                                </Grid>    
                            </Grid>
                        </form>
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
