import { redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"
import type { PageServerLoad } from "./$types"
import {superValidate} from 'sveltekit-superforms'
import {zod} from 'sveltekit-superforms/adapters'

export const actions: Actions = {
    signup: async({request, locals: {supabase}}) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if(!email.endsWith('@ucsd.edu')){
            return {error: "Must use a UCSD email"}
        }

        const {error} = await supabase.auth.signUp({email, password})

        

        if(error){
            console.error(error)
            return {error: error.message}
        } else {
            return {success: true}
        }
    },
    login: async({request, locals: {supabase}}) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const {error} = await supabase.auth.signInWithPassword({email, password})
        if(error){
            console.error(error)
            return {error: error.message}
        } else {
            redirect(303, '/')
        }
    }
}