
<!-- routify:meta reset -->
<script>
    import {routeSends, routePotential, studentPoints} from '$utils/contest'
    import Canvas from '$components/contest/Canvas.svelte'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { _getDoc } from '$utils/firebase/firestore/basics';
    import { printName } from '$utils/printName';
    import {params} from '@roxi/routify'
    const MAX_POINTS = 1000
    const eventId = $params.id
    let event
    let scores = []

    const unsub = onSnapshot(doc(db, "events", eventId), (event) => {
            updateScores(event)
            scores = scores
    })

    const printRoute = (routeId) =>{
        const route = event.data().routes.filter(x=>x.id===routeId)[0]
        return `${route.grade} ${route.color} ${route.lineTxt}`
    }

    const getEvent = async ()=>{
        event = await _getDoc('events', eventId)
        updateScores(event)
    }

    getEvent()

    const updateScores = (event)=>{
        scores = []
        for (const route of event.data().routes) {
            scores.push({...route, potential: routePotential(route.id, event, MAX_POINTS), sends: routeSends(route.id, event)})
        }
        console.log(scores);
        console.log("UPTODATE!");
    }
    


    

</script>

{#if event}
    <Canvas {scores}/>

    <h2>Voies</h2>
    {#each event.data().routes as route}
        {route.grade} {route.color} {route.lineTxt} =>>>> {routePotential(route.id, event)}<br>
    {/each}

    <h2>Classement</h2>
    {#each event.data().participants as student}
        {printName(student)} =>>>> {studentPoints(student.id, event, MAX_POINTS)}<br>
    {/each}

    <h2>Runs</h2>
    <ul>
        {#each event.data().runs as run}
            <li>{printName(event.data().participants.filter(x=>x.id===run.student)[0])} {printRoute(run.route)}</li>
        {/each}
    </ul>

{:else}
    No event
{/if}
