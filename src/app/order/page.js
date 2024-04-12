
'use client';
import TitlePage from "@/components/UI/TitlePage";
import ProductsCounter from "@/components/products/ProductsCounter";
import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';
import OrderCard from "@/components/orders/OrderCard";
import {getOrderList} from '../../services/api/order.api';
import empty from '../../../public/empty.svg';
import Loader from "@/components/UI/Loader";


export default function Page() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const items = await getOrderList()
                if(items.success){
                    console.log(items.results)
                    setOrders(items.results)
                }
            } catch (err) {
                console.log(err)
            } finally{
                setLoading(false);
            }

        }
            fetchOrders();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto">
            <TitlePage title="Order history" />
            <div className="flex flex-row">
                <div className="mr-10">
                    <span className="font-semibold">Order details</span><br/>
                    <span>Review and manage recent orders</span>
                </div>
                <div className="w-full">
                <ProductsCounter productsLength={orders.length} text="commande" />
                {orders && orders.length > 0 && (
                    <>
                    <div className="min-h-screen flex flex-row py-4">
                            <div className="w-full flex flex-col">
                                <div className="flex flex-row w-full">
                                    <div className="basis-1/5 text-left">Order id</div>
                                    <div className="basis-1/5 text-center">Ordered On</div>
                                    <div className="basis-1/5 text-center">Delivery Mode</div>
                                    <div className="basis-1/5 text-center">Price</div>
                                    <div className="basis-1/5 text-center">Status</div>
                                </div>
                                {orders.map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        </div></>
                )}
                {orders && orders.length === 0 && (
                    <Image className="mx-auto my-5" src={empty} alt="empty" width={300} height={400}></Image>
                )}
            </div>
            </div>
            
        </div>
    )
}