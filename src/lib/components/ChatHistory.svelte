<script lang="ts">
  import { Clipboard, Check } from 'lucide-svelte';
  
  type Message = string;
  type Conversation = Message[];
  
  interface ChatHistoryProps {
      history: Conversation[];
  }
  
  let { history }: ChatHistoryProps = $props();
  let copiedIndex = $state<null | number>(null);
  
  // Function to format message content with code blocks
  function formatMessage(message: string) {
      let formattedContent: any[] = [];
      let isCodeBlock = false;
      let codeBlock = '';
      let codeBlockIndex = 0;
      
      // Process the message content
      message.split('\n').forEach((line: string) => {
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
      
      return formattedContent;
  }
  
  function copyToClipboard(text: string, index: number) {
      navigator.clipboard.writeText(text).then(() => {
          copiedIndex = index;
          setTimeout(() => (copiedIndex = null), 2000);
      });
  }
</script>

<div class="flex flex-col items-center w-full max-w-[1000px] mx-auto p-4">
  <h1 class="text-4xl font-bold mb-6">Chat History</h1>
  <div class="flex flex-col space-y-4 w-full">
      {#if history.length === 0}
          <p class='text-center'>No history yet!</p>
      {/if}
      {#each history as conversation}
          <div class="flex flex-col space-y-2 border-2 border-gray-200 p-4 rounded-md">
              {#each conversation as message, i}
                  <div class={`p-3 rounded-lg ${i % 2 === 0 ?
                      'bg-blue-100 self-end' :
                      'bg-gray-100 self-start'}`}>
                      <!-- Format message content -->
                      {#each formatMessage(message) as block}
                          {#if block.type === 'code'}
                              <div class="code-block-container border border-slate-300 rounded-sm mt-2 mb-2">
                                  <pre><code>{block.content}</code></pre>
                                  <button class="copy-button" on:click={() => copyToClipboard(block.content, block.index)}>
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
              {/each}
          </div>
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
</style>