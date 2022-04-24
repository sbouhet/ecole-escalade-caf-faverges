<!-- routify:meta reset -->
<script>
    import { currentSeason, admin } from "$utils/stores"
    import { getDayName, getDayFromUrl} from '$utils/days'
    import Boolean from "$components/Boolean.svelte"
    import { deleteStudent } from '$firestore/deleteStudent'
    import { capitalize } from '$utils/capitalize'
    import { getAuth } from "firebase/auth"
import { printName } from "$utils/printName";
    
    export let students = []
    export let allowDelete = false
    export let links = false
    export let showDay = true
    export let myProfile = false

    let table
    $:if(table){
        new Tablesort(table)
    }
</script>


{#if students.length > 0}
    <figure>
        <table role="grid" bind:this={table}>
            <thead>
                <tr>
                    
                    {#if $admin && allowDelete}<th scope="col">Del</th>{/if}
                    <th scope="col">Prénom</th>
                    {#if !myProfile}
                        <th scope="col">Nom</th>
                    {/if} 
                    {#if showDay}
                        <th scope="col">Créneau</th>
                    {/if}
                    <th scope="col">Status</th>
                    <th scope="col">Licence</th>
                    <th scope="col">Paiement</th>
                    <th scope="col">Certificat médical</th>
                </tr>
            </thead>
            <tbody>
                {#each students as student}
                {#if student.seasons[$currentSeason.name]}
                <tr>
                    {#if $admin && allowDelete}
                        <td class="del" on:click={()=>deleteStudent(student.id)}>🗑</td>
                    {/if}
                    {#if myProfile}
                        <td><a href={`./mon-compte/${student.id}`} role="button" class="outline">{capitalize(student.firstName)}</a></td>
                    {:else if links}
                        <td><a href={`/admin/${student.id}`}>{capitalize(student.firstName)}</a></td>
                        <td>{student.lastName.toUpperCase()}</td>
                    {:else}
                        <td>{capitalize(student.firstName)}</td>
                        <td>{student.lastName.toUpperCase()}</td>
                    {/if}
                    {#if showDay}
                    
                        <td>
                            <div class="day">
                                {getDayName(getDayFromUrl(student.seasons[$currentSeason.name].day, $currentSeason.days))}
                            </div>
                        </td>
                    {/if}
                    <td>{#if student.seasons[$currentSeason.name].status==='waiting'}
                        <span data-tooltip="Pré‑inscrit·e, en cours de validation.">⌛</span>
                        {:else if student.seasons[$currentSeason.name].status==='yes'}
                        <span data-tooltip="Inscrit·e">✅</span>
                        {:else}
                        {student.seasons[$currentSeason.name].status}
                        {/if}
                    </td>
                    <td><Boolean value={student.seasons[$currentSeason.name].licence}/></td>
                    <td><Boolean value={student.seasons[$currentSeason.name].payment}/></td>
                    <td><Boolean value={student.seasons[$currentSeason.name].medicalCertificate}/></td>
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
</style>