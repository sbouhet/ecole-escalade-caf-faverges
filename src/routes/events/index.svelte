
<script>
    import { _getDoc, _getDocs, _query } from '$utils/firebase/firestore/basics';
     let events, loading

     const getEvents = async () =>{
        loading = true
        events = await _query('events', 'timestamp', '>', 0, 'timestamp', 'desc' )
        loading = false
     }

     getEvents()
</script>


{#if loading}
    loading
{:else}
    {#if events}
       
        {#each events as event}
            <a href="./events/{event.id}" role="button">{event.data().title}</a> <br><br>
        {/each}
    {:else}
        Pas d'évènements
    {/if}
{/if}
