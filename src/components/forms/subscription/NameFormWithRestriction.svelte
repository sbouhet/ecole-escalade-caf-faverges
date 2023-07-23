<script>
    import {_getDoc, _getDocs, _query}from '$firestore/basics'
    import {normalize} from '$utils/normalize'
    import { printName } from '$utils/printName';
    import {allowWrongAge} from '$utils/stores'
    import { seasons } from "$utils/seasons"
    export let firstName, lastName

    let selectedStudent, searchInput
    let releventStudents = []

    $:if(selectedStudent){
        firstName = selectedStudent.firstName
        lastName = selectedStudent.lastName
        $allowWrongAge = selectedStudent.allowed
    }

    const getPriorityStudents = async ()=>{
        const adminDoc = await _getDoc('admin', 'admin')
        const priorityStudents = adminDoc.data().priorityStudents.map(x=> {return {firstName: normalize(x.firstName), lastName:normalize(x.lastName), allowed:x.allowed}})
        console.log("priority", priorityStudents);
        releventStudents = priorityStudents
        return priorityStudents
    }

    const getPastStudents = async ()=>{
        const pastStudents = await _query('students', `seasons.${seasons().last}.payment`, "==", "yes" )
        const formatted = pastStudents.map(x=> {return {firstName: normalize(x.data().firstName), lastName:normalize(x.data().lastName), allowed:"false"}})
        console.log('formatted', formatted);
        releventStudents = formatted
        return formatted
    }

    //const priorityStudents = getPriorityStudents()
    const priorityStudents = getPastStudents()
   
    const handleChange = (priorityStudents)=>{
        if(searchInput){
            releventStudents = priorityStudents.filter(
                x=>(x.firstName+' '+x.lastName).includes(normalize(searchInput))
                || (x.lastName+' '+x.firstName).includes(normalize(searchInput)))
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

    {#if searchInput}    
        {#if releventStudents.length<=0}
            <small style="color:red">Aucun élève ne correspond à cette recherche</small>
        {:else if releventStudents.length === 1}
            <small>Élève trouvé !</small>
        {:else}
            <small>{releventStudents.length} élèves correspondent à cette recherche</small>
        {/if}
    {:else}
        <small>&nbsp;</small>
    {/if}
    <label for="student">Choisissez l'élève à inscrire</label>
    <select id="student" required bind:value={selectedStudent} class={releventStudents.length === 1?'success':''}>
        {#each releventStudents as student}
            <option value={student}>{printName(student)}</option>
        {/each}
    </select>
    {#if releventStudents.length === 1}   
        <small style="color:green"><span>✓</span> Élève trouvé.</small>
    {:else}
        <small><span>&nbsp;</span></small>  
    {/if}

{/await}



<style>
    span{
        font-size: x-large;
        font-weight: bold;
        margin-right: 0.1em;
    }
   
</style>