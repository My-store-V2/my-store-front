'use client'

import Typography from '@mui/material/Typography';
import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined'
import Alert from "@/components/UI/Alert";
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { login, getUser } from "../../services/api/auth.api";
import { useRouter } from 'next/navigation'


const Page = () => {
    const router = useRouter();
    const [alert, setAlert] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    // form validation rules
    const validationSchema = Yup.object().shape({
        email: Yup.string()
        .required("Email required")
        .email('Enter a valid email address'),
        password: Yup.string()
        .required('Password required')
        .min(6, 'Minimum 6 characters required')
        .max(40, 'Password must not exceed 40 characters'),
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    })

    const onSubmit = (data) => {
        login(data)
        .then(async (res) => {
            setAlert({type:"success", message: res.message})
            console.log(res)
            if(res.success){
                localStorage.setItem('storeToken', res.token);
                await getUser()
                .then((data) => {
                    localStorage.setItem("currentUser", JSON.stringify(data?.user))
                    router.push("/shop");
                })
            }
        })
    }
    return (
        <div className="container mx-auto">
            {
                alert && (
                    <Alert message={alert.message} type={alert.type} />
                )
            }
            <div className="min-h-screen flex flex-col items-center">
                <div className='my-16 text-center'>
                    <Typography variant="h4">
                        Welcome back
                    </Typography>
                    <Typography variant="caption" gutterBottom>
                        Enter your email and password
                    </Typography>
                </div>
                <form>
                    <div className="form-group">
                    <TextField
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
                    <div className="flex flex-row justify-between items-center mt-[-10px]">
                    <FormControlLabel
                        control={<Checkbox size="small" />}
                        className="text-sm form-control"
                        value={true}
                        label={<span className="text-xs">Se souvenir de moi</span>}
                    />

                    <Link href="#" underline="always" className="text-xs font-light">
                        Mot de passe oublié?
                    </Link>
                    </div>
                    <div className="mt-10 flex flex-col mx-auto items-center w-min">
                        <Button
                            type="submit"
                            className="px-14 font-bold"
                            variant="outlined"
                            onClick={handleSubmit(onSubmit)}
                        >
                            Login
                        </Button>
                        <Link
                            href="/register"
                            underline="always"
                            className="text-xs font-light my-2"
                        >
                            Pas encore inscrit?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Page;
