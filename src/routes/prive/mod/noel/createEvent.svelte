<script>
    import {_getDocs, _getDoc, _addDoc} from '$utils/firebase/firestore/basics'
    import {normalize} from '$utils/normalize'
    import { printName } from "$utils/printName"
    import Route from './components/Route.svelte'
    let title, loading, students, input, releventStudents, routes, gyms, selectedGym, lines
    let participants = []
    let selectedRoutes = []

    function removeDuplicates(arr) {
        return arr.filter((item,index) => arr.indexOf(item) === index);
    }

    const getStudents = async ()=>{
        loading = true
        students = await _getDocs("students")
        loading = false
    }
    getStudents()

    const getGyms = async ()=>{
        loading = true
        gyms = await _getDocs("gyms")
        loading = false
    }
    getGyms()

    const getRoutesAndLines = async (gymName)=>{
        routes = await _getDocs('gyms', gymName, 'routes')
        lines = removeDuplicates(routes.map(x=>x.data().line));
        lines.sort(function(a, b) {
        return a - b;
        });
    }

    $:if(selectedGym){
        getRoutesAndLines(selectedGym.id)
    }

    $:if(students && input){
        releventStudents = students.filter(
                x=>(normalize(x.data().firstName+' '+x.data().lastName)).includes(normalize(input))
                || (normalize(x.data().lastName+' '+x.data().firstName)).includes(normalize(input)))
    }

    const addStudent = (student)=>{
        if (participants.map(x=>x.id).includes(student.id)) return
        participants.push({id: student.id, firstName: student.data().firstName, lastName: student.data().lastName})
        participants=participants
    }

    const removePax = (pax)=>{
        participants.splice(participants.indexOf(pax), 1)
        participants=participants
    }

    const selectRoute = (route)=>{
        if (selectedRoutes.map(x=>x.id).includes(route.id)) {
            selectedRoutes.splice(selectedRoutes.map(x=>x.id).indexOf(route.id), 1)
        }else{
            selectedRoutes.push({id:route.id, lineNb: route.data().line, lineTxt: selectedGym.data().lines[route.data().line-1],grade: route.data().grade, color: route.data().color})
        }
        selectedRoutes = selectedRoutes
    }

    const createEvent = async ()=>{
        console.log(title, participants, selectedRoutes);
        await _addDoc({title, participants, routes: selectedRoutes}, "events")
    }

</script>

<h1>Créer un évenement</h1>

<input type="text" bind:value={title}>

<h3>Participants</h3>
{#each participants as pax}
    <div>{printName(pax)} <a href="#" on:click={()=>removePax(pax)}>🗑️</a></div>
{/each}
<br><br>

<input type="text" bind:value={input}>


{#if loading}
    Merci de patienter...
{:else if releventStudents && input && releventStudents.length < 10}
    <ul>
        {#each releventStudents as student}
            <li><a href='#' on:click={()=>addStudent(student)}>{printName(student.data())}</a></li>
        {/each}
    </ul>
{/if}

<h3>Voies</h3>

{#if loading}
    Merci de patienter...
{:else if gyms}
    {#each gyms as gym}
        <a href="#" role="button" on:click={()=>selectedGym = gym}>{gym.id}</a>
    {/each}
{/if}
<br>

{#if selectedGym && lines}
    {#each lines as line}
        <h3>Ligne {line}</h3>
        {#each routes.filter(x=>x.data().line==line) as route}

            <div on:click={()=>selectRoute(route)}>
               <Route route={route.data()} />
                {#if selectedRoutes.map(x=>x.id).includes(route.id)}
                    ----- SELECTION
                {/if}
            </div>
        {/each}
        <br>
    {/each}
{/if}

<button on:click={createEvent}>Créer l'évenement</button>


<style>
    .route{
        padding: 15px;
        margin: 10px;
        font-weight: bold;
        width: 300px;
    }
</style>
