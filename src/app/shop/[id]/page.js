"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import { getProduct } from '@/services/api/product.api.js';
import BreadCrumb from "@/components/UI/Breadcrumb";
import TitlePage from '@/components/UI/TitlePage';
import ProductFancyBox from "@/components/products/ProductFancyBox";
import Loader from "@/components/UI/Loader";
import Alert from "@/components/UI/Alert";
import SelectableChip from '@/components/products/SelectableChip'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import WarningIcon from '@mui/icons-material/Warning';

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
export default function Page() {

    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [placehodlerImage, setPlaceholderImage] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slideIndex, setSlideIndex] = useState(0);
    const [showFancyBox, setShowFancyBox] = useState(false);
    const [error, setError] = useState(null);
    const [selectedChip, setSelectedChip] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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

    const addToCart = () => {
        if(selectedChip === null){
            setOpen(true)
        }
    }

     useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                let product = await getProduct(id);
                if (product.success) {
                    setProduct(product.results);
                }
            }
            catch (err) {
                setError(err)
            }
            finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        const fetchPlaceholderImage = async () => {
            try {
                const placeholder = product.thumbnail;
                setPlaceholderImage(placeholder);
            } catch (error) {
                console.error('Error fetching placeholder image:', error.message);
            }
            };
        if (product) {
            setSelectedImage(product?.thumbnail);
            fetchPlaceholderImage();
        }
    }, [product]);

    if (loading) return <Loader />;

    const goToNextSlide = () => {
        setSelectedImage(slideIndex === 0 ? product.packshot : product.thumbnail);
        setSlideIndex(slideIndex === 0 ? 1 : 0);
    }

    const goToPrevSlide = () => {
        setSelectedImage(slideIndex === 0 ? product.packshot : product.thumbnail);
        setSlideIndex(slideIndex === 0 ? 1 : 0);
    }

    return (
        <div className="container mx-auto py-12">
            {
                error && (
                    <Alert message={error.message} type="error" />
                )
            }
            {
                !product && (
                    <Alert message="No products found" type="error" />
                )
            }
            {
                showFancyBox && (
                    <ProductFancyBox
                        img={selectedImage}
                        prevSlide={() => goToPrevSlide()}
                        nextSlide={() => goToNextSlide()}
                        close={() => { setShowFancyBox(false) }}
                    />
                )
            }
            <BreadCrumb current_page={product?.name} />
            <div className="flex">
                {placehodlerImage && selectedImage ? <div className="thumbnail lg:flex-1">
                    <div
                        onClick={() => setShowFancyBox(true)}
                        className="group/show w-4/5 h-[550px] overflow-hidden cursor-pointer">
                        <Image
                            blurDataURL={placehodlerImage}
                            className="object-cover h-full w-full group-hover/show:scale-105 transition ease-in-out delay-150 z-1"
                            alt={product.name}
                            src={selectedImage}
                            width={500}
                            height={500}
                        />
                    </div>
                    <div className="carousel flex mt-4 overflow-hidden">
                        <div className="item w-[100px] h-[100px] mr-2">
                            <Image
                                className="cursor-pointer object-cover h-full w-full "
                                alt={product.name}
                                src={product.thumbnail}
                                width={100}
                                height={100}
                                onMouseOver={() => {
                                    setSelectedImage(product.thumbnail);
                                    setSlideIndex(0);
                                }}
                                onClick={() => {
                                    setSelectedImage(product.thumbnail);
                                    setSlideIndex(0);
                                }}
                            />
                        </div>
                        <div className="item w-[100px] h-[100px]">
                            <Image
                                className="cursor-pointer object-cover h-full w-full"
                                alt={product.name}
                                src={product.packshot}
                                width={100}
                                height={100}
                                onMouseOver={() => {
                                    setSelectedImage(product.packshot);
                                    setSlideIndex(1);
                                }}
                                onClick={() => {
                                    setSelectedImage(product.packshot);
                                    setSlideIndex(1);
                                }}
                            />
                        </div>
                    </div>
                </div> : null}
                <div className="content lg:flex-1 p-6">
                    <TitlePage title={product.name} />
                    <p className="mb-3 font-semibold text-lg">{product.price} €</p>
                    <p className="leading-7 mb-3">{product.description}</p>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <IconButton aria-label="warning">
                                <WarningIcon color='error' />
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
                    <div className="cursor-pointer transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white"
                        onClick={addToCart}>
                        Add to cart
                    </div>
                </div>
            </div>
        </div>
    );
}
