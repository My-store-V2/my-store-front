"use client";
import * as React from "react";
import {
    TextField,
    MenuItem,
    FormControl,
    Typography,
    InputLabel,
    InputAdornment,
    FormHelperText,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Select from "@mui/material/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductsCounter from "@/components/products/ProductsCounter";
import { useState, useEffect, useContext } from "react";
import Alert from "@/components/UI/Alert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { getWishList, getProduct } from "@/services/api/product.api.js";
import Grid from "@mui/material/Grid";
import { IMaskInput } from "react-imask";
import { useRouter } from "next/navigation";
import { getCityByCode } from "../../services/api/global.api";
import { editUser, getUser } from "../../services/api/auth.api";
import PhoneIcon from "@mui/icons-material/Phone";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
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
                "#": /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) =>
                onChange({ target: { name: props.name, value } })
            }
            overwrite
        />
    );
});

TextMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
export default function Page() {
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
            .email("Enter a valid email address"),
        phone: Yup.string().matches(phoneRegExp, "Enter a valid phone number"),
        address: Yup.string(),
        zipcode: Yup.string().matches(
            postalRegExp,
            "Enter a valid postal code"
        ),
        city: Yup.string(),
    });

    const {
        register,
        getValues,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleCity = (event) => {
        setCity(event.target.value);
    };

    const handleCodePostal = async (code, e) => {
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
        editUser(data).then(async (res) => {
            setAlert({
                type: res.success ? "success" : "error",
                message: res.message,
            });

            if (res.success) {
                const currentUser = await getUser();
                if (currentUser) {
                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(currentUser.user)
                    );
                    setUser(currentUser.user);
                    handleClose();
                }
            }
        });
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                let wishlist = await getWishList();
                if (wishlist.success) {
                    const finalList = await Promise.all(
                        wishlist.results.map(async (item) => {
                            const product = await getProduct(item.id_product);
                            return {
                                ...product.results,
                                isFavorite: true, // Assuming details is an object returned from the service call
                            };
                        })
                    );
                    setProducts(finalList);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchProduct();
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user) {
            setUser(user);
            setValue("firstname", user.firstname);
            setValue("lastname", user.lastname);
            setValue("address", user.address);
            setValue("phone", user.phone);
            setValue("email", user.email);
            setValue("zipcode", user.zipcode);
            handleCodePostal(user.zipcode);
            setValue("city", user.city);
            setCity(user.city);
        }
    }, []);

    useEffect(() => {
        const handleSmoothScroll = () => {
            if (window.location.hash === "#wishlist") {
                let element = document.querySelector("#wishlist");
                element.scrollIntoView({
                    behavior: "smooth",
                });
            }
        };

        handleSmoothScroll();
    }, []);

    return (
        <div>
            <div id="history" className="bg-slate-100 min-h-screen">
                <div className="container mx-auto flex flex-col">
                    <span className="text-3xl font-semibold mt-12 mb-8 text-start">
                        Orders
                    </span>
                </div>
            </div>
        </div>
    );
}
