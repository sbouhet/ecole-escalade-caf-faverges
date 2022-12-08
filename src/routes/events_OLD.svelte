<script>
    import { _getDoc, _getDocs, _query } from '$utils/firebase/firestore/basics';
     import {params} from '@roxi/routify'
     const eventId = $params.id
     let event, loading
     $:if (eventId) {
        getEvent()
     }

     const getEvent = async () =>{
        loading = true
        if (eventId==='latest') {
            const events = await _query('events', 'timestamp', '>', 0, 'timestamp', 'desc' )
            event = events[0].data()

        }else{
            event = await _getDoc('events', eventId)
        }
        loading = false
     }
</script>

{#if eventId}
    {#if loading}
        loading
    {:else}
        {#if event}
            <h1>{event.title}</h1>
            <h3>Catégories</h3>
            {#each event.categories as cat}
                <a href="#" role="button">{cat}</a> &nbsp;
            {/each}
        {:else}
            Pas d'évènement
        {/if}
    {/if}
{:else}
    Pas d'id
{/if}