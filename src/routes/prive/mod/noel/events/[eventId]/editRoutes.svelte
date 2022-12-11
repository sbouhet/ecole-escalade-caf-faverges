<script>
    import { _getDoc, _getDocs, _updateDoc } from '$utils/firebase/firestore/basics'
    import { arrayUnion, doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import {params} from '@roxi/routify'
    import Routes from '$components/contest/Routes.svelte'
    import { gymRouteToEventRoute } from '$utils/contest';
    const eventId = $params.eventId

    let event, loading, formatedRoutes, gym
    
    const getEvent = async() =>{
        loading = true
        event = await _getDoc('events', eventId)
        gym = await _getDoc('gyms', event.data().gymName)
        const gymRoutes = await _getDocs('gyms', gym.id, 'routes')
        formatedRoutes = gymRoutes.map(x=>gymRouteToEventRoute(x, gym))
        loading = false
    }
   
    const unsub = onSnapshot(doc(db, "events", eventId), (event) => {
           getEvent()
    })

    const addMulticolor = async ()=>{
        gym.data().lines.forEach(async function (value, i) {
            await _updateDoc(
                { routes:arrayUnion({
                    color:'Toutes prises',
                    grade:'TP',
                    lineNb:i+1,
                    lineTxt: value,
                    id:`TP${i}`})},
                    'events',
                    eventId
            )
            
        })
        console.log('done');
    }
</script>



{#if event && formatedRoutes}
    <h1>{event.data().title}</h1>

    <h2>Rajouter ou supprimer des voies</h2>
    <a href="#" on:click={addMulticolor}>Rajouter des voies toutes prises dans tous les couloir</a>
    <br><br>
    <Routes  menuSettings={{type:'event', eventId, showDel:true, showAdd:true}} routes={formatedRoutes} {event}/>

{/if}

{#if event && formatedRoutes}
    <h3>Voies à problème qui ne sont pas dans gym</h3>

    {#each event.data().routes as route, i}
        <div class={formatedRoutes.map(x=>x.id).includes(route.id) ? 'faded' : ''}>
            {i}: {route.grade} {route.color} {route.lineTxt}<br>
        </div>
        
    {/each}
        
{/if}

<style>
    .faded{
        opacity: 0.3;
    }
</style>