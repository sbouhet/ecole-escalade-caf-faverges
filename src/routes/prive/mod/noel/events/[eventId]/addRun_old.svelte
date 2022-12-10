<script>
    import { _getDoc, _addDoc, _updateDoc } from '$utils/firebase/firestore/basics';
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import Routes from '$components/contest/Routes.svelte'
    import Route from '$components/contest/Route.svelte'
    import { printName } from '$utils/printName';
    import {normalize} from '$utils/normalize'
    import {params} from '@roxi/routify'
    import { arrayUnion } from 'firebase/firestore';
    import { nbOfRuns, routePotential, studentPoints } from '$utils/contest';
    let id = $params.eventId
    let event, loading, releventStudents, paxInput, selectedStudent, selectedRoute, lines, routes, nameForm
    let selectedCategorie, catStudents, confirmButton, gradeInput, gradeForm, releventRoutes, hidden

    const unsub = onSnapshot(doc(db, "events", id), (event) => {
        getEvent()
    })

    function removeDuplicates(arr) {
        return arr.filter((item,index) => arr.indexOf(item) === index);
    }

    function compare( a, b ) {
    if ( a.firstName < b.firstName ){
        return -1;
    }
    if ( a.firstName > b.firstName ){
        return 1;
    }
    return 0;
    }
    
    const getEvent = async ()=>{
        loading = true
        event = await _getDoc("events", id)
        routes = event.data().routes
        lines = removeDuplicates(routes.map(x=>x.lineNb));
        lines.sort(function(a, b) {
        return a - b;
        });
        loading = false
    }
    getEvent()

    $:if (nameForm) {
        nameForm.focus()
    }
    $:if (gradeForm) {
        gradeForm.focus()
    }
    $:if (confirmButton) {
        confirmButton.focus()
    }
   
    $:if (event) {
        if (selectedCategorie!=undefined) {
            catStudents = event.data().participants.filter(x=>x.categorie == selectedCategorie)
        }else{
            catStudents = event.data().participants
        }
        catStudents.sort(compare)
        if(paxInput){
            releventStudents = catStudents.filter(
                    x=>(normalize(x.firstName+' '+x.lastName)).includes(normalize(paxInput))
                    || (normalize(x.lastName+' '+x.firstName)).includes(normalize(paxInput)))
        }else{
            releventStudents = catStudents
        }
        if (gradeInput) {
            releventRoutes = event.data().routes.filter(x=>x.grade.includes(gradeInput))
        }else{
            releventRoutes = event.data().routes
        }
    }
  

    const addRun = async()=>{
        hidden = true
        await _updateDoc({runs: arrayUnion({student: selectedStudent.id, route: selectedRoute.id})}, "events", id)
        console.log("done");
        selectedRoute = undefined
        selectedStudent = undefined
        selectedCategorie = undefined
        paxInput = ''
        hidden = false
    }

    const toggleCategorie = (catIndex)=>{
        if (selectedCategorie == catIndex) {
            selectedCategorie = undefined
        }else{
            selectedCategorie = catIndex
        }
    }
</script>

{#if loading}
    Merci de patienter
{:else}
    {#if event}
        {#if !selectedStudent}
            {#each event.data().categories as cat, i}
                <a href="#" role="button" class={selectedCategorie==i?'':'outline'} on:click={()=>toggleCategorie(i)}>{cat}</a> &nbsp;
            {/each}
            <br><br>
            
            <h3>Nom</h3>
            <form on:submit|preventDefault={()=>selectedStudent=releventStudents[0]}>
                <input type="text" bind:value={paxInput} bind:this={nameForm}>
            </form>
            {#if releventStudents}
                <ul>
                    {#each releventStudents as student}
                        <li><a href='#' on:click={()=>selectedStudent=student}>{printName(student, releventStudents)}</a></li>
                    {/each}
                </ul>
            {/if}
        {:else }
            <h1>{printName(selectedStudent)}</h1>
            {#if !selectedRoute}
                Cotation:
                <form on:submit|preventDefault={()=>selectedRoute=releventRoutes[0]}>
                    <input type="text" bind:value={gradeInput} bind:this={gradeForm}>
                </form>
                <Routes {event} routeList={releventRoutes} bind:selectedRoute={selectedRoute}/>
            {:else}
                <Route route={selectedRoute} {event}/>   
                <br>
                <strong>Ligne {selectedRoute.lineNb} ({selectedRoute.lineTxt})</strong>
                <br><br>
                {#if !hidden}
                    Nombre de voies : {nbOfRuns(event, selectedStudent.id)+1}<br>
                    Points de la voie : {routePotential(selectedRoute.id, event, 1000)} points<br>
                    Total pour {printName(selectedStudent, [])} : {routePotential(selectedRoute.id, event, 1000)+studentPoints(selectedStudent.id, event, 1000)}
                    <br><br>
                    <form on:submit|preventDefault={addRun}>
                        <button on:click={addRun} style="max-width: 300px;" class="outline" bind:this={confirmButton}>Valider</button>
                    </form>
                {/if}
             {/if}
        {/if}

     
    {:else}
        Pas d'evenement avec cet id
    {/if}
{/if}

