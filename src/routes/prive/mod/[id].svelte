<script>
    export let context
    import {params, goto} from '@roxi/routify'
    import { getStudent } from '$firestore/getStudent'
    import { printName } from '$utils/printName'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import { currentSeason, admin } from '$utils/stores'
    import { translate } from '$utils/TRANSLATE'
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import { doc, onSnapshot, arrayUnion } from "firebase/firestore";
    import { db } from "$utils/firebase/firebase"
    import { deleteStudent } from '$firestore/deleteStudent'
    import DisplayObject from '$components/htmlElements/DisplayObject.svelte'
    import ChangeStatus from '$components/modals/ChangeStatus.svelte'
    import { capitalize } from '$utils/capitalize'
    import Contact from '$components/htmlElements/Contact.svelte'
    import { _query, _updateDoc } from '$utils/firebase/firestore/basics'

    let student, showModifyDatabase, showChangeStatus

    //Listen to changes in student public data
    const unsub = onSnapshot(doc(db, "students", $params.id), async (doc) => {
        student = await getStudent($params.id)
    })

    //Listen to changes in student private data
    const unsubPrivate = onSnapshot(doc(db, "students", $params.id, "privateCol", "privateDoc"), async (doc) => {
        student = await getStudent($params.id)
        
    })

    const addParent =  async ()=>{
        let secondEmail
        if(student.private.parents[1] && student.private.parents[1].email) secondEmail = student.private.parents[1].email
        const email = prompt("Renseignez l'email du parent à ajouter", secondEmail)
        if(!email) return
        const users = await _query('users', 'email', '==', email)
        if (users.length<=0) {
            alert('Aucun utilisateur trouvé pour cette adresse email')
            return
        }else if(users.length>1){
            alert('Plusieurs utilisateurs trouvé aec cette adresse email')
            return
        }else if(users.length===1){
            const user = users[0]
            _updateDoc({parents:arrayUnion(user.id)}, 'students', student.id)
        }
    }
</script>

{#if student && student.public && student.private}
    <hgroup>
        <h1>{printName(student.public)}</h1>
        <h5>
            {student.id}
            {#if student.public.seasons[$currentSeason.name].licenceNb}
                <br>{student.public.seasons[$currentSeason.name].licenceNb}
            {/if}
        </h5>
    </hgroup>
    {$currentSeason.name} : <strong>{student.public.seasons[$currentSeason.name].day}</strong>
    {#if student.public.seasons[$currentSeason.name].timestamp}
        <small>(inscrit·e le {dayjs.unix(student.public.seasons[$currentSeason.name].timestamp).format('DD MMMM à HH:mm')})</small>
    {/if}
    <br><br>
    <div on:click={()=>showChangeStatus=true} style='cursor:pointer'>
        {#each ['payment', 'medicalCertificate', 'licence'] as field}
             {capitalize(translate(field))} : <Boolean value={student.public.seasons[$currentSeason.name][field]} big={true}/>
             {#if field==='payment' && student.public.seasons[$currentSeason.name].paymentType}
                <small>({translate(student.public.seasons[$currentSeason.name].paymentType)})</small>
             {/if}
             <br>
        {/each}
    </div>
    <br>
    <a href={`/prive/mod/sendEmail?id=${student.id}`} role="button">Envoyer un email</a>
    <a href="#" role="button" on:click={()=>showChangeStatus=true}>Changer les status</a>
    <a href={`/prive/mon-compte/${student.id}`} target='_new' role="button">Aide à l'inscription</a>
    <br><br>
    <Contact {student}/>
    <br><br>
    {#if $admin}
        <a href="#" role="button" class="danger" on:click={()=>deleteStudent(student.id)}>Supprimer</a>
    {:else}
        <a href="#" role="button" class="danger" disabled>Supprimer</a>
    {/if}
    <a href="#" role="button" class={showModifyDatabase?'secondary':'secondary outline'} on:click={()=>showModifyDatabase=!showModifyDatabase}>
        Base de donnée
    </a>
    <a href="#" role="button" class="secondary" on:click={addParent}>Ajouter un parent</a>
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