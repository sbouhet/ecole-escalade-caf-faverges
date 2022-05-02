<script>
    import {_getDoc}from '$firestore/basics'
    import {normalize} from '$utils/normalize'
    import {capitalize} from '$utils/capitalize'
    export let firstName, lastName

    let selectedStudent, searchInput, filled
    $:if(selectedStudent){
        firstName = selectedStudent.firstName
        lastName = selectedStudent.lastName
    }

    const getPriorityStudents = async ()=>{
        const all = await _getDoc('tmp', 'all')
        const priorityStudents = all.data().priorityStudents.map(x=> {return {firstName: normalize(x.firstName), lastName:normalize(x.lastName)}})
        return priorityStudents
    }

    const priorityStudents = getPriorityStudents()
   
    let releventStudents = []
    const handleChange = (priorityStudents)=>{
        filled = false
        releventStudents = priorityStudents.filter(x=>x.firstName.includes(normalize(searchInput))||x.lastName.includes(normalize(searchInput)))
        //if (releventStudents.length===1) pickStudent(releventStudents[0].firstName, releventStudents[0].lastName)
    }

    const pickStudent = (fName, lName)=>{
        firstName = capitalize(fName.toLowerCase())
        lastName = lName
        filled = true
        searchInput = ''
    }

    
</script>
    {#await priorityStudents}
        ...
    {:then priorityStudents} 
    <div class={filled?'faded':''}>
        <label for="search">Nom</label>
        <input type="search" id="search" name="search" placeholder="Chercher le nom de la personne à inscrire" bind:value={searchInput} on:input={()=>handleChange(priorityStudents)}>
        {#if !filled && releventStudents.length < 5 && releventStudents.length>0}
        <br>
            <ul>
                <small>Cliquez sur le bouton correspondant :</small>               
                {#each releventStudents as student}
                    <li>
                        <div role="button" class="primary" on:click={()=>pickStudent(student.firstName, student.lastName)}>
                            {capitalize(student.firstName.toLowerCase())} {student.lastName}
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
    {/await}

    {#if firstName && lastName} 
        <strong>{firstName} {lastName}</strong>
        <br><br>
    {/if}
        


    <style>
        li{
            list-style: none;
        }
        strong{
            color: var(--primary);
            font-size: larger;
        }

        .faded{
            opacity: 0.5;
        }
    </style>



