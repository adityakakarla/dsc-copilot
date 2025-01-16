<script lang='ts'>
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	  import Messages from '$lib/components/Messages.svelte';
    import SubmitIcon from '~icons/mdi/arrow-up-circle';
    import RestartIcon from '~icons/mdi/circle-arrows'
   
    let textareaElement: HTMLTextAreaElement;
    let prompt = $state<string>('')
    let messages = $state<{role: "user" | "assistant", content: string}[]>([])
    let loading = $state<boolean>(false);
      let {data} = $props()
    let {supabase, user} = $derived(data);

    const classes = [
      'DSC 10',
      'DSC 20',
      'DSC 30',
      'DSC 40A',
      'DSC 40B',
      'DSC 80',
    ]
   
    function autoGrow(e: Event) {
      const textarea = e.target as HTMLTextAreaElement;
      textarea.style.height = `${Math.min(textarea.scrollHeight, 500)}px`;
    }
   
    function handleSubmit({formData}: {formData: FormData}) {
      messages.push({role: "user", content: textareaElement.value})
      formData.append('messages',JSON.stringify({messages}))
      textareaElement.value = ''
      textareaElement.style.height = '40px';
      loading = true
    return async ({result}: any) => {
        messages.push({role: "assistant", content: result.data.message})
      console.log(messages)
      loading = false

    };
    }
   </script>
   
   {#if messages.length === 0}
   <h1 class={`pt-16 text-center text-4xl`}>What can I help you with today?</h1>
   {:else}
   <Messages {messages} {loading}/>
   {/if}
   <form 
     method="POST" 
     class={`w-full max-w-[700px] flex flex-col rounded-lg border border-slate-300 p-3 mt-10 mb-4`}
     use:enhance={handleSubmit}
   >
     <textarea
       bind:this={textareaElement}
       bind:value={prompt}
       name="prompt"
       class="pt-1 pb-2 w-full resize-none focus-visible:outline-none disabled:cursor-not-allowed text-sm text-black placeholder:text-slate-400 font-light overflow-y-auto"
       placeholder={!user ? "login or sign up to start talking to copilot" : "help me understand hypothesis tests"}
       oninput={autoGrow}
       required
     ></textarea>
     <div class='flex justify-between'>
      <div class='flex items-center space-x-4'>
        {#if messages.length === 0}
				<div class="relative">
					<select
						name="class"
						class="relative w-full cursor-pointer appearance-none rounded-lg border border-slate-300
                  py-1 pl-2 pr-6 text-sm hover:border-slate-400 focus:outline-none
                  disabled:cursor-not-allowed disabled:bg-gray-100"
						required
            disabled={!user}
					>
						{#each classes as c}
							<option value={c} class="py-2 text-sm">
								{c}
							</option>
						{/each}
					</select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
						<svg
							class="h-4 w-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M19 9l-7 7-7-7"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
          
				</div>
        {/if}
        <button class='text-sm bg-black hover:bg-slate-500 text-white py-1 px-2 rounded-lg disabled:bg-slate-500 transition duration-200 ease-in-out'
        type='button' onclick={() => {
          messages = []
          prompt = ''
          }} disabled={loading || !user}>+ New Chat</button>
      </div>
      <button 
      disabled={loading || prompt === '' || !user}
      class='hover:text-slate-500 transition duration-200 ease-in-out disabled:text-slate-500'>
        <SubmitIcon style='font-size:1.5em'/>
      </button>
     </div>
     
   </form>

   {#if !user}
   <button onclick={async () => await goto('/auth')}
    class='bg-black hover:bg-slate-500 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out'>Get Started</button>
   {/if}