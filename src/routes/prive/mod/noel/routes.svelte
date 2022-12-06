<script>
    import {params} from '@roxi/routify'
    import { _getDoc, _updateDoc, _query, _getDocs } from '$utils/firebase/firestore/basics';
    import Route from './components/Route.svelte'
    let gym = $params.gym
    let routes, lines
    let lineNames = []

    function removeDuplicates(arr) {
        return arr.filter((item,index) => arr.indexOf(item) === index);
    }
 
    const run = async ()=>{
        const gymDoc = await _getDoc('gyms', gym)
        routes = await _getDocs('gyms', gym, 'routes')
        lineNames = gymDoc.data().lines
        lines = removeDuplicates(routes.map(x=>x.data().line));
        lines.sort(function(a, b) {
        return a - b;
        });
        console.log(lines);
    }

    run()

</script>

<br><br>
{#if routes}
    {#each lines as line}
        <h3>Ligne {line} ({lineNames[line-1]})</h3>
        {#each routes.filter(x=>x.data().line==line) as route}
            <Route route={route.data()}/>
        {/each}
        <br>
    {/each}
{:else}
    Aucune salle ne correspond au nom {gym}
{/if}
