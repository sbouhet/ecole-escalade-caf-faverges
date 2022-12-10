<script>
    import { _getDoc, _addDoc, _updateDoc } from '$utils/firebase/firestore/basics';
    import {params} from '@roxi/routify'
    let id = $params.eventId
    let event, loading


    
    const getEvent = async ()=>{
        loading = true
        event = await _getDoc("events", id)
        console.log(event.data());

        loading = false
    }
    getEvent()


</script>

{#if loading}
    Merci de patienter
{:else}
    {#if event}
        <h1>{event.data().title}</h1>

        <a href="./{id}/addRun" role="button">Ajouter un run</a><br>
        <br><br>
        <a href="./{id}/scores">Graphique</a><br>
        <br>
        <a href="./{id}/editEventRoutes">Modifier les voies</a><br>
        <a href="./{id}/editEventPax">Modifier les participants</a><br>
        <a href="./{id}/deleteRun">Supprimer un run</a><br>
     
    {:else}
        Pas d'evenement avec cet id
    {/if}
{/if}

