<script>
    import { _getDoc, _getDocs, _query } from '$utils/firebase/firestore/basics';
     import {params} from '@roxi/routify'
     const eventId = $params.eventId
     let event, loading
     $:if (eventId) {
        getEvent()
     }

     const getEvent = async () =>{
        loading = true
        if (eventId==='latest') {
            const events = await _query('events', 'timestamp', '>', 0, 'timestamp', 'desc' )
            event = events[0]

        }else{
            const doc = await _getDoc('events', eventId)
            event = doc
        }
        loading = false
     }
</script>

{#if eventId}
    {#if loading}
        loading
    {:else}
        {#if event}
            <h1>{event.data().title}</h1>
            <h3>Catégories</h3>
            {#each event.data().categories as cat, i}
                <a href="./{event.id}/{i}" role="button">{cat}</a> &nbsp;
            {/each}
        {:else}
            Pas d'évènement
        {/if}
    {/if}
{:else}
    Pas d'id
{/if}