<script>
    import { enhance } from "$app/forms";
    import Cards from "$lib/components/Cards.svelte";
    const testimonials = [
		{
			quote:
				'Amazing!',
			name: 'Pranav Singh',
			title: "HDSI '26",
			image: 'pranav.webp'
		},
		{
			quote:
				"Helped a lot in DSC 80",
			name: 'Ganesh Kumarappan',
			title: "HDSI '27",
			image: 'ganesh.webp'
		},
        {
			quote:
				"Got me an A+ in 40B",
			name: 'Ritvik Chand',
			title: "HDSI '27",
			image: 'ritvik.webp'
		},
        {
			quote:
				"Insane for coding",
			name: 'Inderveer Basra',
			title: "UCSD '26",
			image: 'inderveer.webp'
		},
	];

    let {form} = $props()
</script>


{#if form?.success}
<h2 class='text-4xl mt-20'>Thanks for signing up.</h2>
<p class='mt-6'>Should be getting an email soon, but there's a chance you don't.</p>
<p>This means you either already have an account or there was an error.</p>
{:else}

<h1 class='text-6xl font-semibold mt-20 text-center'>Finish Homework 3x Faster</h1>
<h3 class='mt-4 mb-12 text-2xl text-center text-slate-600'>Join DSC Copilot today</h3>
{#if form?.error}
<p class='text-red-600 mb-4'>{form.error}</p>
{/if}
<form method="POST" action="?/login" class='flex flex-col space-y-8 border-2 border-slate-300 p-4 rounded-lg w-full max-w-[400px]' use:enhance>
    <label class='flex flex-col space-y-2'>
        <h3 class='text-lg'>Email</h3>
        <input name="email" type="email" class='text-sm border-2 border-slate-300 p-1 rounded-sm focus:outline-none'>
    </label>
    <label class='flex flex-col space-y-2'>
        <h3 class='text-lg'>Password</h3>
        <input name="password" type="password" class='text-sm border-2 border-slate-300 p-1 rounded-sm focus:outline-none'/>
    </label>
    <div class='w-full flex space-x-2 text-sm'>
        <button class='bg-black hover:bg-slate-500 transition duration-100 ease-in-out text-white px-4 py-2 rounded-lg'>Login</button>
        <button class='bg-black hover:bg-slate-500 text-white px-4 py-2 rounded-lg' formaction="?/signup">Sign up</button>
    </div>
    
</form>
{/if}
<Cards items={testimonials} direction='right' speed='slow' pauseOnHover={false}/>