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
import Image from 'next/image';
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
import { Toaster, toast } from 'react-hot-toast';
import TitlePage from "@/components/UI/TitlePage";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import empty from '../../../public/empty.svg';
import CartContext from '../../context/cart';



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

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, minHeight: 500 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const AntTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontSize: 18,
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(0, 0, 0, 0.85)',
}));
export default function Page(){

    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { setIsConnected } = useContext(CartContext);
    const router = useRouter();
    const [alert, setAlert] = React.useState(null);
    const [cities, setCities] = React.useState([]);
    const [city, setCity] = React.useState("");
    const [validCode, setValidCode] = React.useState(false);

    const [index, setIndex] = React.useState(0);

    const handleChange = (event, newValue) => {
      setIndex(newValue);
    };


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

  const logout = () => {
      localStorage.removeItem('storeToken');
      localStorage.removeItem('currentUser');
      setIsConnected(false);
      router.push('/login');
  }

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
                    toast.success('Votre profil a bien été modifié !');
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
                setIndex(1)
            }
            
        };

        handleSmoothScroll();
     }, []);

     return (
        <div className="container mx-auto">
            <TitlePage title="Account details" />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={index} onChange={handleChange} aria-label="basic tabs example">
                <AntTab label="Profile" {...a11yProps(0)} />
                <AntTab label="Wishlist" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={index} index={0}>
              {user && (<div className='flex flex-row items-center justify-between'>
                  <div className='py-4 flex flex-col w-full'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-2xl font-semibold mb-3'>{user?.firstname} {user?.lastname}</span>
                      <div onClick={handleOpen} className="cursor-pointer transition ease-in-out delay-150 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white">
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
                    </div>
                    <div className='mb-2'>
                      <p className="text-sm text-slate-500">Email address</p>
                      <span>{user?.email}</span>
                    </div>
                    <div className='mb-2'>
                      <p className="text-sm text-slate-500">Phone number</p>
                      <span>{user?.phone}</span>
                    </div>
                    <Divider className='my-4' />
                    <div className='flex flex-col'>
                      <div className='mb-2'>
                        <p className="text-sm text-slate-500">Zip code</p>
                        <span>{user?.zipcode}</span>
                      </div>
                      <div className='mb-2'>
                        <p className="text-sm text-slate-500">City</p>
                        <span>{user?.city}</span>
                      </div>
                      <div className='mb-2'>
                        <p className="text-sm text-slate-500">Address</p>
                        <span>{user?.address}</span>
                      </div>
                    </div>
                    <div className='flex flex-row-reverse'>
                      <div onClick={logout} className="justify-self-end cursor-pointer w-min items-center px-4 py-3 text-sm font-medium text-center text-white bg-red-600">
                          Logout
                      </div>
                    </div>
                  </div>
                <Toaster />
              </div>)}
            </CustomTabPanel>
            <CustomTabPanel value={index} index={1}>
              <div id="wishlist">
                <div className='mx-auto flex flex-col'>
                    {
                      products && products.length === 0 && (
                        <div>
                          <Image className="mx-auto my-5" src={empty} alt="empty" width={300} height={400}></Image>
                          <div className='mx-auto text-center'>No product found</div>
                        </div>
                      )
                    }
                    {
                       products && products.length > 0 && (<div>
                            <ProductsCounter productsLength={products?.length} />
                            <ProductsGrid products={products} />
                        </div>)
                    }
                </div>
              </div>
            </CustomTabPanel>

          </div>
    );
}
