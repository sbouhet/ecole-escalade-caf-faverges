<script>
    import { _getDoc, _query } from '$utils/firebase/firestore/basics'
    import Routes from '../../../prive/mod/noel/components/Routes.svelte'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { pointsWithStudents, nbOfRuns} from '$utils/contest'
    import {params} from '@roxi/routify'
    const catIndex = $params.categorie
    const eventId = $params.eventId
    
    let event, loading, categorie, points, routes

    const getEvent = async () =>{
        loading = true
        event =  await _getDoc('events', eventId)
        categorie = event.data().categories[catIndex]
        loading = false
     }

     getEvent()

     const unsub = onSnapshot(doc(db, "events", eventId), (event) => {
        getEvent()
           if (event) {
            points = pointsWithStudents(event, catIndex, 1000)
           }
    })
</script>

{#if event}
    <Routes {event}/>
{/if}