<!-- routify:meta reset -->
<script>
    import { currentSeason, admin, mod } from "$utils/stores"
    import { getDayName, getDayFromUrl} from '$utils/days'
    import Boolean from "$components/htmlElements/Boolean.svelte"
    import { deleteStudent } from '$firestore/deleteStudent'
    import { capitalize } from '$utils/capitalize'
    import { goto } from '@roxi/routify'
    import { getAuth } from "firebase/auth"
    import { printName } from "$utils/printName";
    
    export let students = []
    export let showDay = true
    export let timestamp = false

    const studentOfCurrentUser = (student)=>{
        if(!getAuth().currentUser) return
        const userId = getAuth().currentUser.uid
        if(student.data().parents.includes(userId)) return true
        return false
    }


    let table, showAdminControls
    $:if(table){
        new Tablesort(table)
    }

    //On click of row (not on a button but the row itself)
    const handleClick = (student)=>{
        //if admin, do nothing
        if($mod) return

        //if not current user's student, do nothing
        if(!studentOfCurrentUser(student)) return

        //if current user's student, go to profile page
        const id = student.id
        $goto("/prive/mon-compte/[id]", {id})
    }
</script>

{#if students.length > 0}
    {#if $mod}
        Admin
        <input type="checkbox" role="switch" bind:checked={showAdminControls}>
    {/if}
    <figure>
        <table role="grid" bind:this={table}>

            <!-- ****************   HEAD    ****************-->
            <thead>
                <tr>
                    <!-- timestamp  -->
                    {#if timestamp && $admin}
                        <th scope="col">Inscription</th>
                    {/if}

                    <!-- admin controls -->
                    {#if ($mod) && showAdminControls}
                        {#if $admin}
                            <th scope="col">Supprimer</th>
                        {/if}
                        <th scope="col">Modifier</th>
                        <th scope="col">Infos</th>
                    {/if}

                    <!-- name -->
                    <th scope="col">Nom</th>

                    {#if $mod}
                        <th scope="col">Email</th>
                    {/if}

                    <!-- day -->
                    {#if showDay}
                        <th scope="col">Créneau</th>
                    {/if}

                    <th scope="col">Compte</th>
                    <th scope="col">Licence</th>
                    <th scope="col">Paiement</th>
                    <th scope="col">Certificat médical</th>
                </tr>
            </thead>

            <!-- ****************     BODY     ************** -->
            <tbody>
                {#each students as student}
                    {#if student.data().seasons[$currentSeason.name]}

                        <!-- Show mouse pointer only if user's student and not an admin -->
                        <tr on:click={()=>handleClick(student)} class={studentOfCurrentUser(student) && !$mod?'':'noPointer'}>

                            <!-- timestamp -->
                            {#if timestamp && $admin}
                                <td>
                                    <small style="opacity:0">{student.data().seasons[$currentSeason.name].timestamp}</small>
                                    <br>
                                    <small>{dayjs.unix(student.data().seasons[$currentSeason.name].timestamp).format("D MMM HH:mm")}</small>
                                    
                                </td>
                            {/if}

                            <!-- admin contrls -->
                            {#if $mod && showAdminControls}
                                {#if $admin}
                                    <td class="del" on:click={()=>deleteStudent(student.id)}>🗑</td>
                                {/if}
                                <td><a href={`/prive/mod/modifyStudent?id=${student.id}`}>⚙</a></td>
                                <td><a href={`/prive/mod/${student.id}`}>Info</a></td>
                            {/if}

                            <!-- name -->
                            {#if $mod || studentOfCurrentUser(student)}
                                <td><a href={`/prive/mon-compte/${student.id}`} role="button" class="outline">{capitalize(student.data().firstName)} {student.data().lastName.toUpperCase()}</a></td>
                            {:else}
                                <td>{capitalize(student.data().firstName)} {student.data().lastName.toUpperCase()}</td>
                            {/if}

                            <!-- email -->
                            {#if $mod}
                                <td><a href={`/prive/mod/sendEmail?id=${student.id}`}>✉</a></td>
                            {/if}

                            <!-- day -->
                            {#if showDay && student.data().seasons[$currentSeason.name].day}
                                <td>
                                    <div class="day">
                                        {student.data().seasons[$currentSeason.name].day}
                                    </div>
                                </td>
                            {/if}
                            
                            <!-- account -->
                            <td><Boolean value=yes/></td>

                            <!-- licence -->
                            <td><Boolean value={student.data().seasons[$currentSeason.name].licence}/></td>

                            <!-- payment -->
                            <td><Boolean value={student.data().seasons[$currentSeason.name].payment}/></td>

                            <!-- certificate -->
                            <td><Boolean value={student.data().seasons[$currentSeason.name].medicalCertificate}/></td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    </figure>
{:else}
     <i style="color:grey">Aucun inscrit</i>
{/if}

<style>
    .del{
        cursor: pointer;
    }
     th{
        cursor:pointer;
        font-weight: bold;
    }

     .day{
         text-transform: capitalize;
     }
     .noPointer:hover{
        cursor: default;
     }
</style>