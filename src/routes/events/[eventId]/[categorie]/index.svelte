<script>
    import {params} from '@roxi/routify'
    import { _getDoc } from '$utils/firebase/firestore/basics'
    const catIndex = $params.categorie
    const eventId = $params.eventId
    let event, loading, categorie

const getEvent = async () =>{
    loading = true
    event =  await _getDoc('events', eventId)
    categorie = event.data().categories[catIndex]
    loading = false
 }

 getEvent()
</script>

{#if categorie}
    <center>
        <h1>{categorie}</h1>
    </center>
    <div class="container">
        <a href="./{catIndex}/points" role="button">Classement</a>
        <!-- <a href="./{catIndex}/routes" role="button">Voies</a> -->
    </div>
{/if}

<style>
   
</style>