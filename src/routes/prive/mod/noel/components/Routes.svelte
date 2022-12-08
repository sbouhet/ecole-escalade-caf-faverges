<script>
    import { _getDoc, _getDocs } from '$utils/firebase/firestore/basics';
    import Route from './Route.svelte'
    export let event, gymName, selectedRoute, routeList
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
    }
    
    getRoutes()
    $:if(routeList){
        routes = routeList
        routes.sort(function(a, b) {
        return a.lineNb - b.lineNb;
        });
    }
    
    $:console.log(selectedRoute);
</script>

{#if routes && lines}
    {#each lines as line, i}
        {#if routes.filter(x=>x.lineNb==i+1).length}
            <h3>Ligne {i+1} ({line})</h3>

            {#each routes.filter(x=>x.lineNb==i+1) as route}
                <Route {route} {edit} {event} bind:selectedRoute={selectedRoute}/><br>
            {/each}

            <br>
        {/if}

    {/each}

{/if}