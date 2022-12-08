<script>
    import { _getDoc, _getDocs } from '$utils/firebase/firestore/basics';
    import {removeDuplicates} from '$utils/removeDuplicates'
    import Route from './Route.svelte'
    export let event, gymName
    export let edit = false

    let lines, routes
    
    const getRoutes = async () =>{

        //Get gym and line names
        const gym = await _getDoc('gyms', gymName || event.data().gymName)
        lines = gym.data().lines
        
        if (!gymName) {
            routes = event.data().routes
        }else{
            routes = []
            const docs = await _getDocs('gyms', gymName, 'routes')
            for (const doc of docs) {
                routes.push({id:doc.id, lineNb: doc.data().line, lineTxt: gym.data().lines[doc.data().line-1],grade: doc.data().grade, color: doc.data().color})
            }
            routes = routes
        }


        //Get lines sorted, no nuplicated
        //lines = removeDuplicates(routes.map(x=>x.lineNb))
        //lines.sort(function(a, b) {return a - b})
    }

   
    getRoutes()
    


</script>

{#if routes && lines}

    {#each lines as line, i}

        <h3>Ligne {i+1} ({line})</h3>

        {#each routes.filter(x=>x.lineNb==i+1) as route}
            <Route {route} {edit} {event}/><br>
        {/each}

        <br>

    {/each}

{/if}