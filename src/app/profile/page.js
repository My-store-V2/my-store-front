"use client";
import * as React from 'react'
import {
  TextField,
  MenuItem,
  FormControl,
  Typography,
  InputLabel,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import * as Yup from 'yup'
import PropTypes from 'prop-types';
import Select from "@mui/material/Select";
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductsCounter from "@/components/products/ProductsCounter";
import { useState, useEffect, useContext } from 'react';
import Alert from "@/components/UI/Alert";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { getWishList, getProduct } from "@/services/api/product.api.js";
import Grid from '@mui/material/Grid';
import { IMaskInput } from 'react-imask';
import { useRouter } from 'next/navigation'
import { getCityByCode } from "../../services/api/global.api";
import { editUser, getUser } from "../../services/api/auth.api";
import PhoneIcon from '@mui/icons-material/Phone';

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

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="0 00 00 00 00"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default function Page(){

    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const router = useRouter();
    const [alert, setAlert] = React.useState(null);
    const [cities, setCities] = React.useState([]);
    const [city, setCity] = React.useState("");
    const [validCode, setValidCode] = React.useState(false);


  const phoneRegExp = /^\d{1}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$|^$/;
  const postalRegExp = /^\d{5}$|^$/;

  const schema = Yup.object().shape({
      lastname: Yup.string().required("Lastname required"),
      firstname: Yup.string().required("Firstname required"),
      email: Yup.string()
      .required("Email required")
      .email('Enter a valid email address'),
      phone: Yup.string().matches(phoneRegExp, "Enter a valid phone number"),
      address: Yup.string(),
      zipcode: Yup.string().matches(postalRegExp, "Enter a valid postal code"),
      city: Yup.string(),
  })

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

   const handleCity = (event) => {
    setCity(event.target.value);
  };

  const handleCodePostal = async (code,e) => {
    getCityByCode(code)
    .then((response) => {
        if (!response.code) {
          setCities(response);
        } else {
          setCities([]);
        }
    })
    .catch((e) => {
        console.log(e);
    });
  };
  const onSubmit = async (data) => {
      editUser(data)
      .then(async (res) => {
        setAlert({type:res.success ? "success" : "error", message: res.message})

        if(res.success){
                const currentUser = await getUser()
                if(currentUser){
                    localStorage.setItem("currentUser", JSON.stringify(currentUser.user))
                    setUser(currentUser.user)
                    handleClose()
                }
            }
      })
  }
    
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
        const user =  JSON.parse(localStorage.getItem('currentUser'))
        if(user){
            setUser(user)
            setValue('firstname', user.firstname);
            setValue('lastname', user.lastname);
            setValue('address', user.address);
            setValue('phone', user.phone);
            setValue('email', user.email);
            setValue('zipcode', user.zipcode);
            handleCodePostal(user.zipcode)
            setValue('city', user.city);
            setCity(user.city)
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
                    <div className='flex flex-row mb-1'>
                        <LocationOnIcon fontSize="small" />
                        <span className='ml-1 text-sm'>{user?.address}, {user.zipcode} {user?.city}</span>
                    </div>
                    <div className='flex flex-row mb-1'>
                        <MailIcon fontSize="small" />
                        <span className='ml-1 text-sm'>{user?.email}</span>
                    </div>
                    <div className='flex flex-row'>
                        <PhoneIcon fontSize="small" />
                        <span className='ml-1 text-sm'>{user?.phone}</span>
                    </div>
                </div>
                <div onClick={handleOpen} className="cursor-pointer transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white">
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
                                        required
                                        id="firstname"
                                        label="Firstname"
                                        variant="outlined"
                                        margin="dense"
                                        className='w-full'
                                        helperText={errors.firstname?.message}
                                        error={errors.firstname ? true : false}
                                        {...register('firstname')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        required
                                        id="lastname"
                                        label="Lastname"
                                        variant="outlined"
                                        margin="dense"
                                        className='w-full'
                                        helperText={errors.lastname?.message}
                                        error={errors.lastname ? true : false}
                                        {...register('lastname')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        required
                                        id="email"
                                        label="Email"
                                        variant="outlined"
                                        margin="dense"
                                        className='w-full'
                                        helperText={errors.email?.message}
                                        error={errors.email ? true : false}
                                        {...register('email')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                    id="phone"
                                    label="Phone number"
                                    variant="outlined"
                                    margin="dense"
                                    className='w-full'
                                    InputProps={{
                                    startAdornment: <InputAdornment position="start">+33</InputAdornment>,
                                    inputComponent: TextMaskCustom
                                    }}
                                    helperText={errors.phone?.message}
                                    error={errors.phone ? true : false}
                                    {...register('phone')}
                                />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="address"
                                        label="Address"
                                        variant="outlined"
                                        margin="dense"
                                        className='w-full'
                                        helperText={errors.address?.message}
                                        error={errors.address ? true : false}
                                        {...register('address')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="zipcode"
                                        label="Postal code"
                                        variant="outlined"
                                        margin="dense"
                                        className='w-full'
                                        helperText={errors.zipcode?.message}
                                        error={errors.zipcode ? true : false}
                                        {...register('zipcode', {
                                            onChange: () =>
                                            handleCodePostal(getValues("zipcode")),
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth sx={{ textAlign: "start" }} margin="dense">
                                        <InputLabel id="demo-simple-select-label">City</InputLabel>
                                        <Select
                                        label="City"
                                        id="city"
                                        autoComplete="city"
                                        {...register("city", {
                                            onChange: (e) => {
                                            handleCity(e);
                                            },
                                        })}
                                        error={errors.city ? true : false}
                                        value={city}
                                        >
                                        {Array.from(cities).map((item, index) => (
                                            <MenuItem value={item.nomCommune} key={index}>
                                            {item.nomCommune}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                        {errors.city ? (!validCode ? (
                                        <FormHelperText error id="component-error-text">
                                            Enter a valid postal code
                                        </FormHelperText>
                                        ) : (
                                        <FormHelperText error id="component-error-text">
                                            {errors.city.message}
                                        </FormHelperText>
                                        )) : (
                                        ""
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <div onClick={handleSubmit(onSubmit)} className="cursor-pointer transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white">
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
