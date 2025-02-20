<!-- App.svelte -->
<script lang="ts">
    import type {PageProps} from './$types'
    import ChatHistory from '$lib/components/ChatHistory.svelte'
    
    let {data}: PageProps = $props();
  </script>
  
  <div class="container mx-auto">
    <ChatHistory history={data.history} />
  </div>