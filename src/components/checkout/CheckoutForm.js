'use client'

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';



const Index = ({ orderId }) => {
    const [stripeLoaded, setStripeLoaded] = useState(false);
    const [error, setError] = useState(null);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (!stripe || !elements) {
            setStripeLoaded(false);
            console.log("stripe not loaded")
        } else {
            setStripeLoaded(true);
            console.log("stripe loaded")
        }
    }, [stripe, elements]);

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        console.log("submitting")
        event.preventDefault();
        if (!stripe || !elements) {
            console.log("stripe not loaded")
            return
        }

        const result = await stripe.confirmPayment({
            //Elements instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: process.env.NEXT_PUBLIC_FRONT_END_URL + "/order/" + orderId,
            },
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
            setError(result.error.message);
        } else {
            // Your customer will be redirected to your return_url. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the return_url.
        }
    };

    return (
        // <div className="min-h-screen mx-auto flex flex-col items-center">

        <form className="w-2/5" onSubmit={handleSubmit}>
            <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">Paiement</h2>
            <PaymentElement />
            <button
                className="w-full mt-5 py-3 bg-black text-white rounded-sm"
                disabled={!stripeLoaded}
            >
                Payer
            </button>
            {error && <div>{error}</div>}
        </form>
        // </div>
    );
}

export default Index;