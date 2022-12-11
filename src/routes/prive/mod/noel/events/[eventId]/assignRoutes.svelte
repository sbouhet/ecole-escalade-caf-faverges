<script>
    import { _getDoc } from '$utils/firebase/firestore/basics'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import {params} from '@roxi/routify'
    import Routes from '$components/contest/Routes.svelte'
    const eventId = $params.eventId

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

    <h2>Assigner les voies</h2>
    <Routes  menuSettings={{type:'event', eventId, showAssign:true}} routes={event.data().routes} showCategories=true {event}/>

{/if}

