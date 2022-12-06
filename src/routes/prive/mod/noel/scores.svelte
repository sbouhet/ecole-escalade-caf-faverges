<!-- routify:meta reset -->
<script>
    import Canvas from './components/Canvas.svelte'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { _getDoc } from '$utils/firebase/firestore/basics';
    import { printName } from '$utils/printName';
    import {params} from '@roxi/routify'
    const MAX_POINTS = 1000
    const eventId = $params.id
    let event
    let scores = []
    let test = 0

    const unsub = onSnapshot(doc(db, "events", eventId), (event) => {
        
            updateScores(event)
            scores = scores
            test++
       
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
            scores.push({...route, potential: routePotential(route.id, event)})
        }
        console.log(scores);
        console.log("UPTODATE!");
    }
    

    const routePoints = (routeId)=>{
        const releventRuns = event.data().runs.filter(x=>x.route==routeId)
        if(releventRuns.length===0) return 0
        return MAX_POINTS/(releventRuns.length)
    }

    const routePotential = (routeId, event)=>{
        const releventRuns = event.data().runs.filter(x=>x.route==routeId)
        if(releventRuns.length===0) return MAX_POINTS
        return MAX_POINTS/(releventRuns.length+1)
    }

    const studentPoints = (studentId)=>{
        let points = 0
        const releventRuns = event.data().runs.filter(x=>x.student===studentId)
        for (const run of releventRuns) {
            points += routePoints(run.route)
        }
        return points
    }

    

</script>

{#if event}
   scores.svelte:<br>
   {scores[2].potential}
   <br>
    Canvas:<br>
    <Canvas {scores} {test}/>

    <h2>Voies</h2>
    {#each event.data().routes as route}
        {route.grade} {route.color} {route.lineTxt} =>>>> {routePotential(route.id, event)}<br>
    {/each}

    <h2>Classement</h2>
    {#each event.data().participants as student}
        {printName(student)} =>>>> {studentPoints(student.id)}<br>
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
