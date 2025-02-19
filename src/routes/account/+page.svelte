<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';
	import { goto } from '$app/navigation';

	import type { PageData } from './$types';
	import Cards from '$lib/components/Cards.svelte';
	const testimonials = [
		{
			quote: 'Amazing!',
			name: 'Pranav Singh',
			title: "HDSI '26",
			image: 'pranav.webp'
		},
		{
			quote: 'Helped a lot in DSC 80',
			name: 'Ganesh Kumarappan',
			title: "HDSI '27",
			image: 'ganesh.webp'
		},
		{
			quote: 'Got me an A+ in 40B',
			name: 'Ritvik Chand',
			title: "HDSI '27",
			image: 'ritvik.webp'
		},
		{
			quote: 'Insane for coding',
			name: 'Inderveer Basra',
			title: "UCSD '26",
			image: 'inderveer.webp'
		}
	];

	let { data } = $props();
	let { subscribed, subscriptionId, supabase, user } = $derived(data);

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		await goto('/auth');
	};
</script>

<div class="mt-16 flex flex-col items-center space-y-12 text-center">
	<h1 class="text-2xl font-semibold">Hey {user?.email}!</h1>
	<div class="itmes-center flex flex-col space-y-2">
		<p>Thanks for using DSC Copilot.</p>
		<p>
			If you have any feedback, shoot me an email (<a
				href="mailto:adi@adikakarla.com"
				class="text-slate-500 transition duration-200 ease-in-out hover:text-slate-600"
				>adi@adikakarla.com</a
			>)
		</p>
	</div>
	<div class="space-x-4 flex flex-row">
		{#if !subscribed}
			<button
				class="rounded-lg bg-purple-700 px-4 py-2 text-white transition duration-100 ease-in-out hover:bg-purple-500"
				><a
					href={`https://buy.stripe.com/test_3cs3eDbQU2XJdNK001?client_reference_id=${user?.id}`}
					target="_blank">Get 10x Higher Usage</a
				></button
			>
		{:else}
			<form method="POST" action="?/unsubscribe" class='flex flex-row w-fit'>
				<input
				name='subscriptionId'
				value={subscriptionId}
				hidden
				>
				<button
					class="rounded-lg border-2 border-slate-600 px-4 py-2 text-black transition duration-100 ease-in-out hover:bg-slate-200"
					>Unsubscribe</button
				>
			</form>
		{/if}
		<button
			onclick={logout}
			class="rounded-lg bg-black px-4 py-2 text-white transition duration-100 ease-in-out hover:bg-slate-500"
			>Log Out</button
		>
	</div>
	<Cards items={testimonials} direction="right" speed="slow" pauseOnHover={false} />
</div>
