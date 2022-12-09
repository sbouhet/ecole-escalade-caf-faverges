<script>
    import { _getDoc, _updateDoc } from '$utils/firebase/firestore/basics'
    import Route from './components/Route.svelte'
    import {printName} from '$utils/printName'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    
    import {params} from '@roxi/routify'
    import { arrayRemove } from 'firebase/firestore';
    let eventId = $params.id
    let event

    const getEvent = async () =>{
        event = await _getDoc('events', eventId)
    }
    
    const unsub = onSnapshot(doc(db, "events", eventId), (event) => {
        getEvent()
    })

    const delRun = async (run)=>{
        const res = confirm('Êtes vous sûrs de vouloir supprimer ca ?')
        if(!res) return
        await _updateDoc({runs:arrayRemove(run)}, 'events', eventId)
        console.log('done');
    }

    const resetRuns = async()=>{
        const res = confirm('Êtes vous sûrs de vouloir TOUT SUPPRIMER !!!!????')
        if(!res) return
        await _updateDoc({runs:[]}, 'events', eventId)
        console.log('done');
    }
</script>

{#if event}
    <a href="#" role="button" on:click={resetRuns}>Tout supprimer</a><br><br>
    {#each event.data().categories as cat,i}
        <h3>{cat}</h3>
        <ul>
            {#each event.data().participants.filter(x=>x.categorie==i) as pax}
                <li>
                    <strong>{printName(pax)}</strong>
                    <ul>
                        {#each event.data().runs.filter(x=>x.student==pax.id) as run}
                            <li on:click={()=>delRun(run)}>
                                {event.data().routes.filter(x=>x.id==run.route)[0].lineTxt}
                                (ligne {event.data().routes.filter(x=>x.id==run.route)[0].lineNb})
                                <Route {event} route={event.data().routes.filter(x=>x.id==run.route)[0]}/>
                            </li>
                        {/each}
                    </ul>
                </li>
            {/each}
        </ul>
    {/each}
{/if}


<style>
    ul li{
        list-style: none;
    }
</style>