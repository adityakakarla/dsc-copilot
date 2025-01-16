<script lang='ts'>
    import markdownit from 'markdown-it'
    const md = markdownit()
    let {message} = $props()
    const result = md.render(message)
</script>

<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
	<div class="max-w-[90%] rounded-lg border border-slate-300 p-3">
        {@html result}
	</div>
</div>