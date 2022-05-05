<script>
    import {_getDoc, _query}from '$firestore/basics'
    import {normalize} from '$utils/normalize'
    import {capitalize} from '$utils/capitalize'
    import {seasons} from '$utils/seasons'
    export let firstName, lastName

    let selectedStudent, searchInput
    let releventStudents = []

    $:if(selectedStudent){
        firstName = selectedStudent.firstName
        lastName = selectedStudent.lastName
    }

    const getPriorityStudents = async ()=>{
        const adminDoc = await _getDoc('admin', 'admin')
        const priorityStudents = adminDoc.data().priorityStudents.map(x=> {return {firstName: normalize(x.firstName), lastName:normalize(x.lastName)}})
        const snap = await _query("students", `seasons.${seasons().last}.status`, ">", "")
        let pastStudents = []
        snap.forEach(student=>{
            pastStudents.push(student)
        })
        console.log(pastStudents)
        
        releventStudents = priorityStudents
        return priorityStudents
    }

    const priorityStudents = getPriorityStudents()
   
    const handleChange = (priorityStudents)=>{
        if(searchInput){
            releventStudents = priorityStudents.filter(x=>x.firstName.includes(normalize(searchInput))||x.lastName.includes(normalize(searchInput)))
        }else{
            releventStudents = priorityStudents
        }
        selectedStudent = releventStudents[0]
    }
    
</script>
 

{#await priorityStudents}
   merci de patienter ...
{:then priorityStudents} 

    <input type="search" id="search" name="search" placeholder="Chercher le nom de l'élève à inscrire" bind:value={searchInput} on:input={()=>handleChange(priorityStudents)}>

    {#if releventStudents.length<=0}
        <small style="color:red">Aucun élève ne correspond à cette recherche</small>
    {:else}
        <small>&nbsp;</small>
    {/if}
    <label for="student">Choisissez l'élève à inscrire</label>
    <select id="student" required bind:value={selectedStudent}>
        {#each releventStudents as student}
        <option value={student}>{capitalize(student.firstName.toLowerCase())} {student.lastName}</option>
        {/each}
    </select>

{/await}



