import { STRIPE_SECRET_KEY } from '$env/static/private'
import type { PageServerLoad, Actions } from './$types'
import Stripe from 'stripe'

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
  depends('supabase:db:subscriptions')
  const { data: subscriptions } = await supabase.from('subscriptions').select()
  const subscribed = subscriptions && subscriptions.length > 0
  let subscriptionId;
  if(subscribed){
    subscriptionId = subscriptions[0].subscription
  }
  return { subscribed, subscriptionId}
}


export const actions: Actions = {
  unsubscribe: async({request, locals: {supabase}}) => {
    const formData = await request.formData()
    const subscriptionId = formData.get('subscriptionId') as string
    const stripe = new Stripe(STRIPE_SECRET_KEY)
    const list = await stripe.subscriptions.list()
    console.log(list)
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    const {error} = await supabase.from('subscriptions').delete().eq('subscription', subscriptionId)
    if(error){
      console.error(error)
    }
  } 
}