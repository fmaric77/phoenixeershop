import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { productId } = req.body;

        // Retrieve the product from Stripe
        const product = await stripe.products.retrieve(productId);

        // Retrieve the price from Stripe
        const prices = await stripe.prices.list({ product: productId });
        const price = prices.data[0];

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: [product.images[0]],
                    },
                    unit_amount: price.unit_amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'], // Specify the countries where you want to ship to
            },
        });
        // Return the session ID
        res.status(200).json({ id: session.id });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}