<script>
    import { _getDocs } from "$utils/firebase/firestore/basics"
    import { goto } from "@roxi/routify"
    import { printName } from "$utils/printName"
    import {normalize} from '$utils/normalize'
    let input, students, releventStudents, loading
    let autoRedirect = true

    const getStudents = async ()=>{
        loading = true
        students = await _getDocs("students")
        loading = false
    }
    getStudents()

    $:if(students && input){
        releventStudents = students.filter(
                x=>(normalize(x.data().firstName+' '+x.data().lastName)).includes(normalize(input))
                || (normalize(x.data().lastName+' '+x.data().firstName)).includes(normalize(input)))
        if (releventStudents.length === 1 && autoRedirect) {
            $goto('/prive/mod/[id]', {id:releventStudents[0].id})
        }
    }
</script>

<h1>Chercher un élève</h1>

<input type="text" bind:value={input}>
<br>
Aller à la page de l'élève automatiquement
<input type="checkbox" role="switch" bind:checked={autoRedirect}>

{#if loading}
    Merci de patienter...
{:else if releventStudents && input && releventStudents.length < 10}
    <ul>
        {#each releventStudents as student}
            <li><a href={`/prive/mod/${student.id}`}>{printName(student.data())}</a></li>
        {/each}
    </ul>
{/if}

<style>
    li{
        list-style: none;
    }
</style>