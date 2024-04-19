'use client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useParams, router } from 'next/navigation'
import { useState, useEffect } from 'react';
import { getOrder } from '@/services/api/order.api.js';
import Loader from '@/components/UI/Loader';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Page = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(0);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [stripeSecret, setStripeSecret] = useState("");

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            let order = await getOrder(id);
            if (order.success) {
                // setStatus(order.orders[0].status)
                setOrder(order.orders[0]);
                if (order.orders[0].stripe_client_secret) {
                    setStripeSecret(order.orders[0].stripe_client_secret)
                }
            }
        } catch (err) {
            console.error("error", err)
            setError(err)
        }
        finally {
            setLoading(false);
        }
    }


    if (loading) return <Loader />;
    if (stripeSecret) return (
        <div className="container mt-20 mx-auto min-h-screen flex flex-col items-center">
            <Elements stripe={stripe} options={{ clientSecret: stripeSecret }}>
                <CheckoutForm orderId={id}/>
            </Elements>
        </div>
    );
    return (<></>)

}

export default Page; 