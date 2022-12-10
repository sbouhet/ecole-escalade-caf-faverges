<script>
    import { _getDocs } from "$utils/firebase/firestore/basics";
    import { printName } from "$utils/printName";
    import {normalize} from '$utils/normalize'
    export let selectedStudent, studentList, showAll, firstNameOnly
    let searchInput, releventStudents, inputForm

    const objToSearch = (student) =>{
        if (student.firstName) {
            return student
        } else {
            return student.data()
        }
    }

    function compare( a, b ) {
    if ( objToSearch(a).firstName < objToSearch(b).firstName ){
        return -1;
    }
    if ( objToSearch(a).firstName > objToSearch(b).firstName ){
        return 1;
    }
    return 0;
    }
    
    const getStudents = async ()=>{
        if (!studentList) {
            studentList = await _getDocs('students')
        }
        releventStudents = studentList
        releventStudents.sort(compare)
    }

    $:if(inputForm)inputForm.focus()
    $:if(studentList)getStudents()

    getStudents()


    const handleInput = ()=>{
        if(!studentList) return
        selectedStudent = undefined
        if(searchInput){
            releventStudents = studentList.filter(
                x=>(normalize(objToSearch(x).firstName+' '+objToSearch(x).lastName)).includes(normalize(searchInput))
                || (normalize(objToSearch(x).lastName+' '+objToSearch(x).firstName)).includes(normalize(searchInput)))
        }else{
            releventStudents = studentList
        }
    }

const selectFirst = ()=>{
    if (releventStudents) {
        selectedStudent = releventStudents[0]
    }
}
 $:if(selectedStudent) searchInput = ''
    
</script>

<form on:submit|preventDefault={selectFirst}>
    Nom ou prénom :
    <input type="text" bind:value={searchInput} on:input={handleInput} bind:this={inputForm}>
</form>

{#if releventStudents && (searchInput || showAll)}
    {#if releventStudents.length<1}
        Aucun resultat
    {:else if releventStudents.length>10 && !showAll}
        Trop de resultats, affinez votre recherche
    {:else}
        <ul>
            {#each releventStudents as student}
                <li>
                    <a href="#" on:click={()=>selectedStudent = student}>
                        {#if firstNameOnly}
                            {printName(objToSearch(student), releventStudents)}
                        {:else}
                            {printName(objToSearch(student))}
                        {/if}
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
{/if}

<style>
     ul li{
        list-style: none;
    }


</style>