<script>
    import Route from "./Route.svelte"
    import { nbOfRuns, routePotential, studentPoints, rank } from '$utils/contest'
    import { _updateDoc } from '$utils/firebase/firestore/basics'
    import { arrayUnion } from 'firebase/firestore'
    import {printName} from '$utils/printName'
    export let route, student, event, reset
    let confirmButton

    const addRun = async()=>{
        await _updateDoc({runs: arrayUnion({student: student.id, route: route.id})}, "events", event.id)
    }

    $:if (confirmButton) {
        confirmButton.focus()
    }

    const runRecorded = ()=>{
        return event.data().runs.filter(x=>x.student==student.id).map(x=>x.route).includes(route.id)
    }

$:console.log(rank(student, event))

</script>

<div class="container">
    <div class="routeContainer">
        <div class="route">
            <div>
                <Route route={route}/>
            </div>
            <div class="line">
                <strong>
                    {route.lineTxt}
                    <small>(ligne {route.lineNb})</small>
                </strong>
                <br>
                {routePotential(route.id, event, 1000, student.categorie)} points
            </div>
        </div>
        <form on:submit|preventDefault={addRun}>
            <div class="buttons">
                {#if !runRecorded()}
                    <button on:click={addRun} style="max-width: 300px;" bind:this={confirmButton}>Ajouter la voie</button>
                    <button on:click={()=>reset=true} style="max-width: 300px;" class="outline" >Annuler</button>
                {:else}
                    <button on:click={()=>reset=true} style="max-width: 300px;" bind:this={confirmButton}>Continuer</button>
                {/if}
            </div>
        </form>
    </div>
    <div class="stats">
        <h4>Statistiques pour {printName(student, [])}</h4>
        Nombre de voies : <strong>{nbOfRuns(event, student.id)}</strong><br>
        <br>
        Points : <strong>{studentPoints(student.id, event, 1000,student.categorie)}</strong><br>
        <br>
        Classement : <strong>{rank(student, event).rank}</strong>
        {#if rank(student, event).otherStudents.length>1}
            <small>
                (Ex aequo avec {rank(student, event).otherStudents.length-1} participants)
            </small>
        {/if}

    </div>
</div>




<style>
    .line{
        margin-top: 5px;
    }

    .buttons{
        display: flex;
        margin-top: 30px;
        width:100%;
        justify-content: center;
        align-items: center;
        border: 0px solid red;
    }

    button{

        margin: 10px;
    }

    .container{
        margin-top: 100px;
        display: flex;
        border: 0px solid red;
        
    }

    .route{
        border: 0px solid green;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .routeContainer{
        display: flex;
        flex-direction: column;
        border: 0px solid purple;
        width: 400px;
    }

    .stats{
        border-left: 1px solid black;
        padding: 10px;
        margin-left: 100px;
    }
</style>
