<script lang='ts'>
    import SvelteMarkdown from 'svelte-markdown'
    let {message} = $props()
</script>

<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
	<div class="max-w-[90%] rounded-lg border border-slate-300 p-3">
		<SvelteMarkdown source={message.content}/>
	</div>
</div>