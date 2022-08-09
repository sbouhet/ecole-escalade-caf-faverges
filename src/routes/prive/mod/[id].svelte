<script>
    export let context
    import {params, goto} from '@roxi/routify'
    import { getStudent } from '$firestore/getStudent'
    import { printName } from '$utils/printName'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import { currentSeason, admin } from '$utils/stores'
    import { translate } from '$utils/TRANSLATE'
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import { doc, onSnapshot } from "firebase/firestore";
    import { db } from "$utils/firebase/firebase"
    import { deleteStudent } from '$firestore/deleteStudent'
    import DisplayObject from '$components/htmlElements/DisplayObject.svelte'
    import ChangeStatus from '$components/modals/ChangeStatus.svelte'
import { capitalize } from '$utils/capitalize';

    let student, showModifyDatabase, showChangeStatus

    //Listen to changes in student public data
    const unsub = onSnapshot(doc(db, "students", $params.id), async (doc) => {
        student = await getStudent($params.id)
    })

    //Listen to changes in student private data
    const unsubPrivate = onSnapshot(doc(db, "students", $params.id, "privateCol", "privateDoc"), async (doc) => {
        student = await getStudent($params.id)
        
    })

</script>



{#if student && student.public && student.private}
    <hgroup>
        <h1>{printName(student.public)}</h1>
        <h5>{student.id}</h5>
    </hgroup>
    <div on:click={()=>showChangeStatus=true} style='cursor:pointer'>
        {#each ['payment', 'medicalCertificate', 'licence'] as field}
             {capitalize(translate(field))} : <Boolean value={student.public.seasons[$currentSeason.name][field]} big={true}/>
             <br>
        {/each}
    </div>
    <br>
    <a href={`/prive/mod/sendEmail?id=${student.id}`} role="button">Envoyer un email</a>
    <a href={`/prive/mod/checkMedicalCertificate?season=${$currentSeason.name}&id=${student.id}`} role="button">Certificat médical</a>
    <a href="#" role="button" on:click={()=>showChangeStatus=true}>Changer les status</a>
    <br>
    {#if $admin}
        <a href="#" role="button" class="danger" on:click={()=>deleteStudent(student.id)}>Supprimer</a>
    {:else}
        <a href="#" role="button" class="danger" disabled>Supprimer</a>
    {/if}
    <a href="#" role="button" class={showModifyDatabase?'secondary':'secondary outline'} on:click={()=>showModifyDatabase=!showModifyDatabase}>
        Base de donnée
    </a>
    <br><br>

    {#if showChangeStatus}
        <h3>Changer le status</h3>
        <ChangeStatus bind:student={student} bind:open={showChangeStatus}/>
    {/if}

    {#if showModifyDatabase}
        <h3>Base de données</h3>
        <DisplayObject object={student} origin='student' {student}/>
    {/if}
{/if}

<slot></slot>

<style>
    .danger{
        background-color: rgb(224, 39, 39);
        border-color: rgb(224, 39, 39);
    }

    a{
        margin-top: 10px;
    }
</style>