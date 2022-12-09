<script>
    import { _getDocs } from "$utils/firebase/firestore/basics";
    import { printName } from "$utils/printName";
    import {normalize} from '$utils/normalize'
    export let selectedStudent
    let allStudents, searchInput, releventStudents, inputForm

    const getStudents = async ()=>{
        allStudents = await _getDocs('students')
        releventStudents = allStudents
        inputForm.focus()
    }

    getStudents()

    const handleInput = ()=>{
        if(!allStudents) return
        selectedStudent = undefined
        if(searchInput){
            releventStudents = allStudents.filter(
                x=>(normalize(x.data().firstName+' '+x.data().lastName)).includes(normalize(searchInput))
                || (normalize(x.data().lastName+' '+x.data().firstName)).includes(normalize(searchInput)))
        }else{
            releventStudents = allStudents
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

{#if releventStudents && searchInput}
    {#if releventStudents.length<1}
        Aucun resultat
    {:else if releventStudents.length>10}
        Trop de resultats, affinez votre recherche
    {:else}
        <ul>
            {#each releventStudents as student}
                <li>
                    <a href="#" on:click={()=>selectedStudent = student}>
                        {printName(student.data())}
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