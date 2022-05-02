<script>
    import {params} from '@roxi/routify'
    import { getStudent } from '$firestore/getStudent'
    import { printName } from '$utils/printName'
    import {changeState} from '$firestore/changeState'
    import Boolean from '$components/htmlElements/Boolean.svelte'
    let seasonName = $params.season
    let studentId = $params.id
    let student = getStudent(studentId)
    let loading = false

    const handleClick = async (status)=>{
        loading = true
        console.log("CHanging state")
        try {
            await changeState(studentId, "medicalCertificate", status, seasonName)
            student = getStudent(studentId)
            console.log("done")
            loading = false
        } catch (error) {
            console.error(error)
            loading = false
        }
    }
</script>

{#await student}
    <p aria-busy="true">Merci de patienter...</p>
{:then student} 
    <h1>{printName(student.public)}</h1>
    <h4>{seasonName}</h4>
    <div><a href={student.private.medicalCertificateLink} target="_new">Certificat médical</a></div>
    <br>
    {#if student.public.seasons[seasonName]}
        <div aria-busy={loading}>Status actuel : <Boolean value={student.public.seasons[seasonName].medicalCertificate} big=true/></div>
        <br>
        <dir role="button" class="outline" on:click={()=>handleClick("yes")}>Valider <Boolean value="yes" big=true/></dir>
        <dir role="button" class="outline" on:click={()=>handleClick("waiting")}>Mettre en attente <Boolean value="waiting" big=true/></dir>
        <dir role="button" class="outline" on:click={()=>handleClick("no")}>Refuser <Boolean value="no" big=true/></dir>
        {:else}
        Lélève n'es pas inscrit sur cette saison
    {/if}
    {/await}
    <br><br><br><br><br>