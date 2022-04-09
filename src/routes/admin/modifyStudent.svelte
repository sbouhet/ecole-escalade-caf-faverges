<script>
    import { changeState, getStudent } from '$utils/firestore'
    import {params} from '@roxi/routify'
    import { printName } from '$utils/printName'
    import { currentSeason } from '$utils/stores'
    import {FIELDS, STATES} from '$utils/STEPS.js'
    const studentId = $params.id
    const student = getStudent(studentId)
</script>

{#await student}
    Merci de patienter...
{:then student} 
    <h1>{printName(student.public)}</h1>
    <div><a href={student.private.medicalCertificateLink} target="_new">Certificat médical</a></div>
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