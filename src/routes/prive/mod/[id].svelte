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
    <a href={`/prive/mod/sendEmail?id=${student.id}`} role="button">Envoyer un email</a>
    <a href="#" role="button" on:click={()=>showChangeStatus=!showChangeStatus}>Changer le status</a>
    <br>
    {#if $admin}
        <a href="#" role="button" class="danger" on:click={()=>deleteStudent(student.id)}>Supprimer</a>
    {:else}
        <a href="#" role="button" class="danger" disabled>Supprimer</a>
    {/if}
    <a href="#" role="button" class={showModifyDatabase?'secondary':'secondary outline'} on:click={()=>showModifyDatabase=!showModifyDatabase}>
        Modifier la base de donnée
    </a>
    <br><br>

    {#if showChangeStatus}
        <h3>Changer le status</h3>
        <ChangeStatus bind:student={student} bind:open={showChangeStatus}/>
    {/if}

    {#if showModifyDatabase}
        <h3>Modifier la base de données</h3>
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