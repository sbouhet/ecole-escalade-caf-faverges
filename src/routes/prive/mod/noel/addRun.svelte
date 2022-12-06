<script>
    import { _getDoc, _addDoc, _updateDoc } from '$utils/firebase/firestore/basics';
    import Route from './components/Route.svelte'
    import { printName } from '$utils/printName';
    import {normalize} from '$utils/normalize'
    import {params} from '@roxi/routify'
    import { arrayUnion } from 'firebase/firestore';
    let id = $params.id
    let event, loading, releventStudents, paxInput, selectedStudent, selectedRoute, lines, routes

    function removeDuplicates(arr) {
        return arr.filter((item,index) => arr.indexOf(item) === index);
    }
    
    const getEvent = async ()=>{
        loading = true
        event = await _getDoc("events", id)
        console.log(event.data());
        routes = event.data().routes
        lines = removeDuplicates(routes.map(x=>x.lineNb));
        lines.sort(function(a, b) {
        return a - b;
        });
        loading = false
    }
    getEvent()

    $:if(event && paxInput){
        releventStudents = event.data().participants.filter(
                x=>(normalize(x.firstName+' '+x.lastName)).includes(normalize(paxInput))
                || (normalize(x.lastName+' '+x.firstName)).includes(normalize(paxInput)))
    }else if (event){
        releventStudents = event.data().participants
    }

    const addRun = async()=>{
        await _updateDoc({runs: arrayUnion({student: selectedStudent.id, route: selectedRoute.id})}, "events", id)
        console.log("done");
    }
</script>

{#if loading}
    Merci de patienter
{:else}
    {#if event}

        {#if !selectedStudent}
            <h3>Nom</h3>
            <input type="text" bind:value={paxInput}>
            {#if releventStudents}
                <ul>
                    {#each releventStudents as student}
                        <li><a href='#' on:click={()=>selectedStudent=student}>{printName(student)}</a></li>
                    {/each}
                </ul>
            {/if}
        {:else }
            <h1>{printName(selectedStudent)}</h1>
            {#if !selectedRoute}
                {#each lines as line}
                    <h4>Ligne {line} ({routes.filter(x=>x.lineNb==line)[0].lineTxt})</h4>
                    {#each routes.filter(x=>x.lineNb==line) as route}
            
                        <span on:click={()=>selectedRoute=route}>
                            <Route {route}/>
                        </span>
                    {/each}
                    <br>
                {/each}
            {:else}
                <strong>{selectedRoute.lineTxt} (ligne {selectedRoute.lineNb})</strong>
                <br><br>
                <Route route={selectedRoute}/>   
                <button on:click={addRun} style="max-width: 300px;" class="outline">Valider</button>
             {/if}
        {/if}

     
    {:else}
        Pas d'evenement avec cet id
    {/if}
{/if}

