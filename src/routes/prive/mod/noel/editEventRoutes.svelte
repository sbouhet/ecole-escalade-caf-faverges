<script>
    import { _getDoc } from '$utils/firebase/firestore/basics'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import {params} from '@roxi/routify'
    import Routes from './components/Routes.svelte'
    const eventId = $params.id

    let event, loading
    
    const getEvent = async() =>{
        loading = true
        event = await _getDoc('events', eventId)
        loading = false
    }
   

    const unsub = onSnapshot(doc(db, "events", eventId), (event) => {
          
           getEvent()
           
    })
</script>

{#if event}
    <h1>{event.data().title}</h1>

    <h2>Rajouter des voies</h2>
    <Routes gymName={event.data().gymName} {event} edit={true}/>


    <!-- <br><br>
    <h2>Voies actuelles ({event.data().routes.length} voies)</h2>
    <Routes {event} edit={true}/> -->
{/if}