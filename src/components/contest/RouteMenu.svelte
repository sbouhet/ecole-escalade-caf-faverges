<script>
    import { _deleteDoc, _updateDoc } from "$utils/firebase/firestore/basics";
    import { arrayRemove, arrayUnion } from "firebase/firestore";
    export let route, menuSettings, event
    let loading

    const delRoute = async() =>{
        loading = true
        if (menuSettings.type==='gym') {
            if(!menuSettings.gymId) console.log('No menuSettings.gymId');
            await _deleteDoc('gyms', menuSettings.gymId, 'routes', route.id)
        } else if(menuSettings.type==='event'){
            if(!menuSettings.eventId) console.log('No menuSettings.eventId');
            await _updateDoc({routes:arrayRemove(route)}, 'events', menuSettings.eventId)
        }
        loading = false
    }

    const addRoute = async()=>{
        loading = true
        await _updateDoc({routes:arrayUnion(route)}, 'events', menuSettings.eventId)
        loading = false
    }

    const addCatIndexToRoute = async (routeId, catIndex)=>{
        loading = true
        const routeIndex = event.data().routes.map(x=>x.id).indexOf(routeId)
        const oldValue = event.data().routes[routeIndex]
        await _updateDoc({routes:arrayRemove(oldValue)}, 'events', event.id)
        if(!oldValue.categories) oldValue.categories = []
        oldValue.categories.push(catIndex)
        const newValue = {...oldValue, categories:oldValue.categories}
        await _updateDoc({routes:arrayUnion(newValue)}, 'events', event.id)
        loading = false
    }

    const removeCatIndexToRoute = async (routeId, catIndex)=>{
        loading = true
        const routeIndex = event.data().routes.map(x=>x.id).indexOf(routeId)
        const oldValue = event.data().routes[routeIndex]
        await _updateDoc({routes:arrayRemove(oldValue)}, 'events', event.id)
        const oldCategories = oldValue.categories
        const index = oldCategories.indexOf(catIndex)
        oldCategories.splice(index, 1)
        const newValue = {...oldValue, categories:oldCategories}
        await _updateDoc({routes:arrayUnion(newValue)}, 'events', event.id)
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
            {#if menuSettings.showAdd}
            <a href="#" role="button" class='outline' on:click={addRoute}>
                Ajouter
            </a>
            {/if}
            {#if menuSettings.showAssign}
                {#each event.data().categories as cat,i}
                    
                    {#if route.categories == undefined}
                        <a href="#" role="button" class='outline' on:click={()=>addCatIndexToRoute(route.id, i)}>
                            {cat}
                        </a>
                    {:else}
                        {#if route.categories.includes(i)}
                            
                            <a href="#" role="button"  on:click={()=>removeCatIndexToRoute(route.id, i)}>
                                {cat}
                            </a>
                        {:else}
                            <a href="#" role="button" class='outline' on:click={()=>addCatIndexToRoute(route.id, i)}>
                                {cat}
                            </a>
                        {/if}
                    {/if}

                    <!-- {#if route.categories !=undefined && route.catgories.includes(i)}
                        <a href="#" role="button" class='outline' on:click={()=>removeCatIndexToRoute(route.id, i)}>
                            {cat}
                        </a>
                    {:else}
                        <a href="#" role="button" on:click={()=>addCatIndexToRoute(route.id, i)}>
                            {cat}
                        </a>
                    {/if} -->
                {/each}
            {/if}
        {/if}
    {:else}
        No route
    {/if}
{:else}
    No menu settings
{/if}