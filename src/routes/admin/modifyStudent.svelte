<script>
    import { changeState } from '$firestore/changeState'
    import { getStudent } from '$firestore/getStudent'
    import { params } from '@roxi/routify'
    import { printName } from '$utils/printName'
    import { currentSeason } from '$utils/stores'
    import {FIELDS, STATES} from '$utils/STEPS.js'
    const studentId = $params.id
    const student = getStudent(studentId)
</script>

{#await student}
<p aria-busy="true">
    Merci de patienter...
</p>
{:then student} 
    <h1>{printName(student.public)}</h1>
    <div><a href={student.private.medicalCertificateLink} target="_new">Certificat médical</a></div>
    <br>
    <br>
    {#each student.public.seasons[$currentSeason.name].receipts as receipt, index}
        <div><a href={receipt} target="_new">Recu {index+1}</a></div>
    {/each}
    <br>
    <br>
    {#each FIELDS as field}
        <section>
            <h5>{field}</h5>
            {#each STATES as state}
                <a href="#" role="button" on:click={()=>changeState(studentId, field, state, $currentSeason.name)}>{state}</a>&nbsp;
            {/each}
        </section>
    {/each}
{:catch}
    Erreur
{/await}

<style>
</style>