<script lang='ts'>
    import HomeIcon from '~icons/mdi/house-variant-outline'
    import AuthIcon from '~icons/mdi/gear-outline'
    import AboutIcon from '~icons/mdi/about-circle-outline'
    import History from '~icons/mdi/history'
    let {authenticated} = $props()
   </script>
   
   <nav class='fixed left-0 top-0 h-full flex flex-col space-y-4 py-10 px-4 border-r border-slate-300 bg-slate-100'>
     <a href='/' class='hover:bg-slate-200 p-1 rounded-lg transition duration-100 ease-in-out'>
       <HomeIcon style="font-size:1.2em"/>
     </a>
     {#if authenticated}
     <a href='/account' class='hover:bg-slate-200 p-1 rounded-lg transition duration-100 ease-in-out'>
      <AuthIcon style="font-size:1.2em"/>
    </a>
    <a href='/history' class='hover:bg-slate-200 p-1 rounded-lg transition duration-100 ease-in-out'>
      <History style="font-size:1.2em"/>
    </a>
     {:else}
     <a href='/auth' class='hover:bg-slate-200 p-1 rounded-lg transition duration-100 ease-in-out'>
      <AuthIcon style="font-size:1.2em"/>
    </a>
     {/if}
     
     <a href='/about' class='hover:bg-slate-200 p-1 rounded-lg transition duration-100 ease-in-out'>
       <AboutIcon style="font-size:1.2em"/>
     </a>
   </nav>