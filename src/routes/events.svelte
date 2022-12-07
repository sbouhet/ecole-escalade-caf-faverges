<!-- routify:meta reset -->
<script>
    import { _getDoc } from '$utils/firebase/firestore/basics';
     import {params} from '@roxi/routify'
     const eventId = $params.id
     let event
     $:if (eventId) {
         event = _getDoc('events', eventId)
     }
</script>

{#if eventId}
    {#await event}
        Merci de patienter...
    {:then event} 
        <h1>{event.data().title}</h1>
        
    {/await}
{:else}
    Pas d'id
{/if}