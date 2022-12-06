<script>
    import { _getDoc, _addDoc, _updateDoc } from '$utils/firebase/firestore/basics';
    import {params} from '@roxi/routify'
    let id = $params.id
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

        <a href="./addRun?id={id}">Ajouter un run</a><br>
        <a href="./scores?id={id}">Scores</a>
     
    {:else}
        Pas d'evenement avec cet id
    {/if}
{/if}

