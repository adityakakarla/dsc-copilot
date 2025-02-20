<script lang="ts">
    type Message = string;
    type Conversation = Message[];
    
    interface ChatHistoryProps {
      history: Conversation[];
    }
    
    let { history }: ChatHistoryProps = $props();
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
            <div class={`p-3 rounded-lg max-w-[90vw]  ${i % 2 === 0 ? 
              'bg-blue-100 self-end' : 
              'bg-gray-100 self-start'}`}>
              <p class="text-sm">{message}</p>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>