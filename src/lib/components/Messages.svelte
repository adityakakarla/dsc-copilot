<script>
	import Message from './Message.svelte';
	let { messages, loading } = $props();
</script>

<div class="flex flex-col items-center w-[90%] max-w-[900px] space-y-4 text-sm">
	{#each messages as message, i}
			<Message {message} />
	{/each}
	{#if loading === true}
    <div class='flex items-center self-start mr-10 w-fit rounded-lg border border-slate-300 p-3'>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="#000"
			viewBox="0 0 256 256"
			class="animate-spin mr-3"
		>
			<path
				d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"
			></path>
		</svg>
		thinking...
    </div>
	{/if}
</div>
