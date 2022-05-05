<!-- routify:meta reset -->
<script>
    import { currentSeason, admin } from "$utils/stores"
    import { getDayName, getDayFromUrl} from '$utils/days'
    import Boolean from "$components/htmlElements/Boolean.svelte"
    import { deleteStudent } from '$firestore/deleteStudent'
    import { capitalize } from '$utils/capitalize'
    import { goto } from '@roxi/routify'
    import { getAuth } from "firebase/auth"
    import { printName } from "$utils/printName";
    
    export let students = []
    export let allowDelete = false
    export let links = false
    export let showDay = true
    export let myProfile = false
    export let timestamp = false

    let table
    $:if(table){
        new Tablesort(table)
    }

    const handleClick = (id)=>{
        if(!myProfile)return
        $goto("/prive/mon-compte/[id]", {id})
    }
</script>


{#if students.length > 0}
    <figure>
        <table role="grid" bind:this={table}>
            <thead>
                <tr>
                    {#if $admin && allowDelete}<th scope="col">Del</th>{/if}
                    {#if timestamp}<th scope="col">Timestamp</th>{/if}
                    <th scope="col">Prénom</th>
                    {#if !myProfile}
                        <th scope="col">Nom</th>
                    {/if} 
                    {#if showDay}
                        <th scope="col">Créneau</th>
                    {/if}
                    <!-- <th scope="col">Status</th> -->
                    <th scope="col">Compte</th>
                    <th scope="col">Licence</th>
                    <th scope="col">Paiement</th>
                    <th scope="col">Certificat médical</th>
                </tr>
            </thead>
            <tbody>
                {#each students as student}
                {#if student.data().seasons[$currentSeason.name]}
                <tr on:click={()=>handleClick(student.id)} class={myProfile?'':'noPointer'}>
                    {#if $admin && allowDelete}
                        <td class="del" on:click={()=>deleteStudent(student.id)}>🗑</td>
                    {/if}
                    {#if timestamp}
                        <td>{student.data().seasons[$currentSeason.name].timestamp}</td>
                    {/if}
                    {#if myProfile}
                        <td><a href={`./mon-compte/${student.id}`} role="button" class="outline">{capitalize(student.data().firstName)}</a></td>
                    {:else if links}
                        <td><a href={`/admin/${student.id}`}>{capitalize(student.data().firstName)}</a></td>
                        <td>{student.data().lastName.toUpperCase()}</td>
                    {:else}
                        <td>{capitalize(student.data().firstName)}</td>
                        <td>{student.data().lastName.toUpperCase()}</td>
                    {/if}
                    {#if showDay && student.data().seasons[$currentSeason.name].day}
                        <td>
                            <div class="day">
                                
                                {getDayName(getDayFromUrl(student.data().seasons[$currentSeason.name].day, $currentSeason.days))}
                            </div>
                        </td>
                    {/if}
                  <!--   <td>{#if student.data().seasons[$currentSeason.name].status==='waiting'}
                        <span data-tooltip="Pré‑inscrit·e, en cours de validation.">⌛</span>
                        {:else if student.data().seasons[$currentSeason.name].status==='yes'}
                        <span data-tooltip="Inscrit·e">✅</span>
                        {:else}
                        {student.data().seasons[$currentSeason.name].status}
                        {/if}
                    </td> -->
                    <!-- <td><Boolean value={student.data().seasons[$currentSeason.name].status}/></td> -->
                    <td><Boolean value=yes/></td>
                    <td><Boolean value={student.data().seasons[$currentSeason.name].licence}/></td>
                    <td><Boolean value={student.data().seasons[$currentSeason.name].payment}/></td>
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
        color:red;
        cursor: pointer;
    }
     th{cursor:pointer; font-weight: bold;}

     span{
         color: rgb(255, 255, 255);
     }
     .day{
         text-transform: capitalize;
     }
     .noPointer:hover{
        cursor: default;
     }
</style>