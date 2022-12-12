<script>
    import { _getDoc} from '$utils/firebase/firestore/basics'
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
        {#if event.data().routes.length}
            <a href="./{id}/addRun" role="button">Ajouter un run</a><br>
            <br><br>
            Voies :<br>
            {#each event.data().categories as cat, i}
                <a href="./{id}/routes?eventId={id}&catIndex={i}" role="button" class="outline">{cat}</a> &nbsp;
            {/each}
            <br><br>
            Classement :<br>
            {#each event.data().categories as cat, i}
                <a href="/events/{id}/{i}/points" role="button" class="outline">{cat}</a> &nbsp;
            {/each}
            <br><br>
            <a href="/events/{id}">Page publique de l'évènement</a><br>
            <br>
            <a href="./{id}/editRoutes">Modifier les voies</a><br>
            <a href="./{id}/delRoutes">Supprimer des voies</a><br>
            <a href="./{id}/editParticipants">Modifier les participants</a><br>
            <a href="./{id}/assignRoutes">Assigner les voies aux catégories d'ages</a><br>
            <a href="./{id}/deleteRun">Supprimer un run</a><br>
        {:else}
            <a href="./{id}/editRoutes" role="button">Ajouter des voies</a><br>
        {/if}
    {:else}
        Pas d'evenement avec cet id
    {/if}
{/if}

