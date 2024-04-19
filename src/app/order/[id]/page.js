
'use client';
import TitlePage from "@/components/UI/TitlePage";
import ProductsCounter from "@/components/products/ProductsCounter";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ProductCartCard from "@/components/products/ProductCartCard";
import empty from '../../../../public/empty.svg';
import Loader from "@/components/UI/Loader";
import { useParams, router } from 'next/navigation'
import { getOrder, editOrder } from '@/services/api/order.api.js';
import Chip from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function Page() {
    const { id } = useParams();
    const [order, setOrder] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        const calculateTotal = () => {
            let totalPrice = 0;
            if (order) {
                order.forEach(item => {
                    totalPrice += item.products.price * item.quantity;
                });
                setTotal(totalPrice);
            }
        };
        calculateTotal();
    }, [order]);

    const demandRefund = async () => {
        await editOrder(id, "refunded on demand")
        router.push("/order")
    }

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                let order = await getOrder(id);
                if (order.success) {
                    setStatus(order.orders[0].status)
                    setOrder(order.results);
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

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto">
            <TitlePage title="Order details" />
            {order && order.length > 0 && (
                <><ProductsCounter productsLength={order.length} /><div className="min-h-screen flex flex-row py-4">
                    <div className="w-full mr-14 flex flex-col">
                        <div className="flex flex-row w-full">
                            <div className="basis-5/12">Product details</div>
                            <div className="basis-1/6">Quantity</div>
                            <div className="basis-1/6">Price</div>
                            <div className="basis-1/4">Total</div>
                        </div>
                        {order.map(product => (
                            <ProductCartCard key={product.id} product={product} readOnly />
                        ))}
                    </div>
                    <div className="border border-slate-300 w-96 h-fit p-3">
                        <span className="text-lg font-semibold">Order summary</span>
                        <div className="py-3">
                            <div className="flex justify-between mb-1">
                                <span className="text-slate-500">Total</span>
                                <span>{total} €</span>
                            </div>
                        </div>
                        <Chip
                            label={status}
                            icon={status == 'payed' ? <CheckIcon /> : status == 'pending' ? <MoreHorizIcon /> : <UndoIcon />}
                            color={status == 'payed' ? "success" : "default"} />
                        {status === 'payed' && (<div className="cursor-pointer w-full transition ease-in-out delay-150 mt-4 inline-flex justify-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white"
                            onClick={demandRefund}>
                            Demand refund
                        </div>)}
                        {status === 'pending' && (
                            <div className="cursor-pointer w-full transition ease-in-out delay-150 mt-4 inline-flex justify-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white"
                                onClick={() => navigation.navigate(`/checkout/payment/${id}`)}>
                                Payment
                            </div>
                        )}
                    </div>
                </div></>
            )}
            {order && order.length === 0 && (
                <Image className="mx-auto my-5" src={empty} alt="empty" width={300} height={400}></Image>
            )}
        </div>
    )
}