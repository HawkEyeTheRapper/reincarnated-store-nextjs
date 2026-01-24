import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

export const config = {
  runtime: "nodejs",
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { cart } = req.body;

      if (!cart || cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const lineItems = cart.map((item: any) => {
        const unitAmount = Math.round(parseFloat(item.price.replace('$', '')) * 100);
        
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };
      });

      const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin;

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB'],
        },
        payment_method_types: ['card'],
      });

      // Return the URL instead of just the session ID
      res.status(200).json({ url: session.url });
    } catch (err: any) {
      console.error('Stripe API Error:', err);
      res.status(err.statusCode || 500).json({ message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export const config = {
  runtime: 'edge',
};
