

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Page = () => {

return (
                <Elements stripe={stripe} options={{ clientSecret: clientSecret }}>
                    <CheckoutForm />
                </Elements>
            );

}