'use client'

import * as React from 'react';
import { useContext } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  Typography,
  IconButton,
  InputLabel,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import Alert from "@/components/UI/Alert";
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import Select from "@mui/material/Select";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Link from '@mui/material/Link'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getCityByCode } from "../../services/api/global.api";
import { signUp, getUser } from "../../services/api/auth.api";
import { useRouter } from 'next/navigation'
import CartContext from '../../context/cart';


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

const Page = () => {
  const router = useRouter();
  const { setIsConnected } = useContext(CartContext);
  const [alert, setAlert] = React.useState(null);
  const [cities, setCities] = React.useState([]);
  const [city, setCity] = React.useState("");
  const [validCode, setValidCode] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [validated, setValidated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confPassword, setConfPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfPassword, setShowConfPassword] = React.useState(false);
  const steps = ['Set informations', 'Create an account'];

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowConfPassword = () => setShowConfPassword((show) => !show)

  const handleMouseDownPassword = (event) => {
      event.preventDefault()
  }

  const phoneRegExp = /^\d{1}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$|^$/;
  const postalRegExp = /^\d{5}$|^$/;

  // form validation rules
  const StepOneSchema = Yup.object().shape({
      lastname: Yup.string().required("Lastname required"),
      firstname: Yup.string().required("Firstname required"),
      phone: Yup.string()
      .matches(phoneRegExp, "Enter a valid phone number"),
      address: Yup.string(),
      zipcode: Yup.string()
      .matches(postalRegExp, "Enter a valid postal code"),
      city: Yup.string(),
  })
  const StepTwoSchema = Yup.object().shape({
      email: Yup.string()
      .required("Email required")
      .email('Enter a valid email address'),
      password: Yup.string()
      .required('Password required')
      .min(6, 'Minimum 6 characters required')
      .max(40, 'Password must not exceed 40 characters')

  })
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(activeStep === 0 ? StepOneSchema : StepTwoSchema,),
  })

    const handleCity = (event) => {
    setCity(event.target.value);
  };

  const onchangeConfPassword = (e) => {
    setConfPassword(e.target.value);
  };

  const handleCodePostal = async (code,e) => {
    getCityByCode(code)
    .then((response) => {
        if (!response.code) {
          setCities(response);
          setValidCode(true)
        } else {
          setCities([]);
          setValidCode(false)
        }
    })
    .catch((e) => {
        console.log(e);
    });
  };
  const onSubmit = async (data) => {
    setValidated(true);
    if(data.password === confPassword){
      data.admin = false;

      signUp(data)
      .then(async (res) => {
        setAlert({type:res.success ? "success" : "error", message: res.message})

        if(res.success){
                localStorage.setItem('storeToken', res.token);
                const currentUser = await getUser()
                if(currentUser){
                    localStorage.setItem("currentUser", JSON.stringify(currentUser.user))
                    setIsConnected(true)
                    router.push("/shop");
                }
            }
      })
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

return (
  <div className="min-h-screen max-w-prose mx-auto">
    {
        alert && (
            <Alert message={alert.message} type={alert.type} />
        )
    }
    <div className="flex flex-col my-16 items-center">
        <div className='mb-6 text-center'>
            <Typography variant="h4">
                User registration
            </Typography>
        </div>
        <Stepper className='w-full' activeStep={activeStep}>
        {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
            <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
            );
        })}
         </Stepper>
        <div>
          <div className="my-8">
            {activeStep === 0 ? (
                <div className="grid grid-rows-3 grid-flow-col gap-x-4">
                  <div className="form-group">
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
                  </div>
                  <div className="form-group">
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
                  </div>
                  <div className="form-group">
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
                  </div>
                  <div className="form-group">
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
                  </div>
                  <div className="form-group">
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
                  </div>
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
                </div>
              ) : (
                <div>
                  <form>
                    <div className="form-group">
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
                    </div>
                    <div className="form-group">
                    <TextField
                        required
                        autoComplete="on"
                        id="standard-adornment-password"
                        className="mt-3"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        margin="dense"
                        helperText={errors.password?.message}
                        error={errors.password ? true : false}
                        {...register('password')}
                        InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? (
                                <VisibilityOffOutlined />
                                ) : (
                                <VisibilityOutlined />
                                )}
                            </IconButton>
                            </InputAdornment>
                        ),
                        }}
                    />
                    </div>
                    <div className="form-group">
                    <TextField
                        required
                        autoComplete="on"
                        id="standard-adornment-password"
                        className="mt-3"
                        label="Confirm password"
                        type={showConfPassword ? 'text' : 'password'}
                        variant="outlined"
                        margin="dense"
                        onChange={onchangeConfPassword}
                        error={getValues("password") !== confPassword && validated}
                        helperText={getValues("password") !== confPassword && validated ? 'Enter the same password' : ''}
                        InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConfPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showConfPassword ? (
                                <VisibilityOffOutlined />
                                ) : (
                                <VisibilityOutlined />
                                )}
                            </IconButton>
                            </InputAdornment>
                        ),
                        }}
                    />
                    </div>
                </form>
                </div>
              )}
              <Link
                href="/login"
                underline="always"
                className="text-xs font-light my-2"
              >
                Déjà inscrit?
            </Link>
          </div>
          <Box className="flex flex-row justify-around w-full">
              <Button
                  color="inherit"
                  variant="outlined"
                  type='submit'
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
              >
                  Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button variant="outlined" onClick={activeStep === steps.length - 1 ? handleSubmit(onSubmit) : handleSubmit(handleNext)}>
                  {activeStep === steps.length - 1 ? 'Register' : 'Next'}
              </Button>
          </Box>
        </div>
    </div>
    
  </div>
  );
}
export default Page;