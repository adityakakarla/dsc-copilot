<script lang="ts">
	import { Clipboard, Check } from 'lucide-svelte';
	let { message } = $props();
	let formattedContent = $state<any[]>([]);
	let copiedIndex = $state<null | number>(null);
	let isCodeBlock = false;
	let codeBlock = '';
	let codeBlockIndex = 0;
	
	// Process the message content
	message.content.split('\n').forEach((line) => {
	  if (line.trim().startsWith('```')) {
		if (isCodeBlock) {
		  formattedContent.push({ type: 'code', content: codeBlock, index: codeBlockIndex++ });
		  codeBlock = '';
		}
		isCodeBlock = !isCodeBlock;
	  } else if (isCodeBlock) {
		codeBlock += line + '\n';
	  } else {
		// Process inline code blocks
		let segments = [];
		let currentText = '';
		let isInlineCode = false;
		
		for (let i = 0; i < line.length; i++) {
		  if (line[i] === '`') {
			// Push accumulated text if any
			if (currentText) {
			  segments.push({
				type: isInlineCode ? 'inline-code' : 'text',
				content: currentText,
				index: isInlineCode ? codeBlockIndex++ : null
			  });
			  currentText = '';
			}
			isInlineCode = !isInlineCode;
		  } else {
			currentText += line[i];
		  }
		}
		
		// Push remaining text
		if (currentText) {
		  segments.push({
			type: isInlineCode ? 'inline-code' : 'text',
			content: currentText,
			index: isInlineCode ? codeBlockIndex++ : null
		  });
		}
		
		formattedContent.push({ type: 'line', segments });
	  }
	});
	
	if (codeBlock) {
	  formattedContent.push({ type: 'code', content: codeBlock, index: codeBlockIndex });
	}
	
	function copyToClipboard(text: string, index: number) {
	  navigator.clipboard.writeText(text).then(() => {
		copiedIndex = index;
		setTimeout(() => (copiedIndex = null), 2000);
	  });
	}
  </script>
  
  <div class="flex w-full {message.role === 'user' ? 'justify-end' : 'justify-start'}">
	<div class="w-fit max-w-[90%] rounded-lg border border-slate-300 p-3">
	  {#each formattedContent as block}
		{#if block.type === 'code'}
		  <div class="code-block-container border border-slate-300 rounded-sm">
			<pre><code>{block.content}</code></pre>
			<button class="copy-button" onclick={() => copyToClipboard(block.content, block.index)}>
			  {#if copiedIndex === block.index}
				<span class="copied-text">Copied</span>
			  {:else}
				<Clipboard size="12" />
			  {/if}
			</button>
		  </div>
		{:else if block.type === 'line'}
		  <p class="text-block">
			{#each block.segments as segment}
			  {#if segment.type === 'inline-code'}
				<code class='inline-code-block'>{segment.content}</code>
			  {:else}
				<span>{segment.content}</span>
			  {/if}
			{/each}
		  </p>
		{/if}
	  {/each}
	</div>
  </div>
  
  <style>
	.code-block-container {
	  position: relative;
	  margin: 0.5rem 0;
	  text-align: left;
	  width: 100%;
	}
	
	pre {
	  background-color: #f3f4f6;
	  padding: 0.5rem;
	  border-radius: 0.375rem;
	  overflow-x: auto;
	  margin: 0;
	  text-align: left;
	}
	
	code {
	  font-family: monospace;
	  display: block;
	  text-align: left;
	}
	
	.copy-button {
	  position: absolute;
	  top: 0.3rem;
	  right: 0.4rem;
	  padding: 0.4rem;
	  background-color: white;
	  border: 1px solid #e5e7eb;
	  border-radius: 0.375rem;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  min-width: 50px;
	}
	
	.copied-text {
	  font-size: 10px;
	  font-weight: 500;
	}
	
	.copy-button:hover {
	  background-color: #f3f4f6;
	}
	
	.text-block {
	  margin-bottom: 0.5rem;
	  white-space: pre-wrap;
	}
	
	.text-block:last-child {
	  margin-bottom: 0;
	}
	
	.inline-code-block {
	  position: relative;
	  display: inline-block;
	  background-color: #f3f4f6;
	  padding: 0.1rem 0.3rem;
	  border-radius: 0.25rem;
	  margin: 0 0.2rem;
	}
	
	.inline-code-block code {
	  display: inline;
	  padding-right: 1.2rem;
	}
	
	.inline-copy-button {
	  position: absolute;
	  top: 50%;
	  right: 0.2rem;
	  transform: translateY(-50%);
	  padding: 0.1rem;
	  background-color: transparent;
	  border: none;
	  opacity: 0;
	  transition: opacity 0.2s;
	}
	
	.inline-code-block:hover .inline-copy-button {
	  opacity: 0.7;
	}
	
	.inline-copy-button:hover {
	  opacity: 1 !important;
	}
  </style>