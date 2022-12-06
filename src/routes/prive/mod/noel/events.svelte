<script>
    import { _getDocs } from "$utils/firebase/firestore/basics";
    let loading
    let events = []

    const getEvents = async ()=>{
        loading = true
        events = await _getDocs("events")
        loading = false
    }
    getEvents()
    
</script>

{#if loading}
    Merci de patienter...
{:else}
    {#if events}
        {#each events as event}
            <a href="./event?id={event.id}">{event.data().title}</a><br>
        {/each}
    {/if}
{/if}