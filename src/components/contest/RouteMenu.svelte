<script>
    import { _deleteDoc, _updateDoc } from "$utils/firebase/firestore/basics";
    import { arrayRemove } from "firebase/firestore";
    export let route, menuSettings
    let loading

    export const delRoute = async() =>{
        loading = true
        if (menuSettings.type==='gym') {
            if(!menuSettings.gymId) console.log('No menuSettings.gymId');
            await _deleteDoc('gyms', menuSettings.gymId, 'routes', route.id)
        } else if(menuSettings.del.type==='event'){
            if(!menuSettings.eventId) console.log('No menuSettings.eventId');
            await _updateDoc({routes:arrayRemove(route)}, 'events', menuSettings.eventId)
        }
        loading = false
    }
</script>

{#if menuSettings}
    {#if route}
        {#if loading}
        <span aria-busy=true></span>
        {:else}
            {#if menuSettings.showDel}
                <a href="#" role="button" class='outline' on:click={delRoute}>
                    🗑️
                </a>
                
            {/if}
        {/if}
    {:else}
        No route
    {/if}
{:else}
    No menu settings
{/if}