import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import Stripe from "stripe";
import type { RequestEvent } from "./$types.js";
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";


const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
const stripe = new Stripe(STRIPE_SECRET_KEY)
const endpointSecret = STRIPE_WEBHOOK_SECRET

function toBuffer(ab: ArrayBuffer): Buffer {
  const buf = Buffer.alloc(ab.byteLength)
  const view = new Uint8Array(ab)
  for (let i = 0; i < Buffer.length; i++) {
    buf[i] = view[i]
  }
  return buf
}

export async function POST(event: RequestEvent) {
  const req = event.request
  let eventType: string
  let data;

  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string | Buffer | string[]

  try {
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    data = event.data
    eventType = event.type
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({
      error: 'error'
    }), { status: 500 })
  }

  switch (eventType) {
    case 'checkout.session.completed':
      const checkoutSession = data.object
      console.log(checkoutSession)
      //@ts-expect-error
      const user_id = checkoutSession.client_reference_id
      //@ts-expect-error
      const customer = checkoutSession.customer
      //@ts-expect-error
      const subscription = checkoutSession.subscription
      const insertion = await supabase.from('subscriptions').insert({
        user_id,
        customer,
        subscription

      })
      if (insertion.error) {
        console.error(insertion.error)
      }
      break
  }


  return new Response(JSON.stringify({
    message: 'success'
  }), { status: 200 })
}