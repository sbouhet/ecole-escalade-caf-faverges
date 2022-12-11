
<!-- routify:meta reset -->
<script>
    import {routeSends, routePotential, studentPoints} from '$utils/contest'
    import Canvas from '$components/contest/Canvas.svelte'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { _getDoc } from '$utils/firebase/firestore/basics';
    import {params} from '@roxi/routify'
    const MAX_POINTS = 1000
    const eventId = $params.eventId
    const catIndex = $params.catIndex
    let event
    let scores = []

    const unsub = onSnapshot(doc(db, "events", eventId), (event) => {
            updateScores(event)
            scores = scores
    })

    const getEvent = async ()=>{
        event = await _getDoc('events', eventId)
        updateScores(event)
    }

    getEvent()

    const updateScores = (event)=>{
        scores = []
        for (const route of event.data().routes.filter(x=>x.categories != undefined && x.categories.includes(parseInt(catIndex)))) {
            console.log('penis');
            scores.push({...route, potential: routePotential(route.id, event, MAX_POINTS, catIndex), sends: routeSends(route.id, event, catIndex)})
        }
        console.log(scores);
    }

</script>

{#if event}
    <Canvas {scores}/>
{/if}