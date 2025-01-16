<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
   
	let { data, children } = $props();
	let {session, supabase} = $derived(data);
   
	onMount(() => {
	  const {data} = supabase.auth.onAuthStateChange((_, newSession) => {
		if (newSession?.expires_at !== session?.expires_at) {
		  invalidate('supabase:auth')
		}
	  })
	  return () => data.subscription.unsubscribe()
	})
   </script>
   
   <div class="h-full min-h-screen w-full text-black flex">
	 <Header/>
	 <div class="flex-1 ml-16 flex flex-col items-center min-h-screen w-full p-10">
	   {@render children()}
	 </div>
   </div>