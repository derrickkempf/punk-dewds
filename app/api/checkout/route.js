import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { punkId } = await req.json()

    if (punkId === undefined || punkId < 0 || punkId >= 10000) {
      return NextResponse.json({ error: 'Invalid punk ID' }, { status: 400 })
    }

    const paddedId = String(punkId).padStart(4, '0')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Punk Dewd #${paddedId} — Original Drawing`,
              description: `The original hand-drawn Punk Dewd #${paddedId} by Derrick Kempf`,
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      metadata: {
        punk_id: String(punkId),
      },
      success_url: `${process.env.NEXT_PUBLIC_URL || req.headers.get('origin')}/app.html?purchased=${punkId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || req.headers.get('origin')}/app.html?punk=${punkId}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
