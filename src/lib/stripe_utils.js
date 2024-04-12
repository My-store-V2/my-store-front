import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise;
let NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const getStripe = () => {
    if (!stripePromise && NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
};

export default getStripe;