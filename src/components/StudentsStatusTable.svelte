<script>
    import { currentSeason, currentUser } from "$utils/stores"
    import { getDayName, getDayFromUrl} from '$utils/days'
    import Boolean from "$components/Boolean.svelte"
    import { deleteStudent } from '$utils/firestore'
    import { capitalize } from '$utils/capitalize'
    import { seasons } from '$utils/seasons'
    export let students = []
    
    let admin = false
    if($currentUser.email==='friarobaz@gmail.com') admin = true

    
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
                    {#if admin}<th scope="col">Del</th>{/if}
                    <!-- <th scope="col">Id</th> -->
                    <th scope="col">Prénom</th>
                    <th scope="col">Nom</th>
                    <th scope="col">E‑mail</th>
                    <th scope="col">Status</th>
                    <th scope="col">Licence</th>
                    <th scope="col">Paiement</th>
                    <th scope="col">Certificat médical</th>
                    <th scope="col">Créneau</th>
                </tr>
            </thead>
            <tbody>
                {#each students as student}
                <tr>
                    {#if admin}
                        <td class="del" on:click={()=>deleteStudent(student.id)}>🗑</td>
                    {/if}
                    <!-- <td>{student.id}</td> -->
                    <td>{capitalize(student.firstName)}</td>
                    <td>{student.lastName.toUpperCase()}</td>
                    <td>{student.parents[0].email}</td>
                    <td>{#if student.status==='Pré‑inscrit(e)'}
                        <span data-tooltip="Pré‑inscrit(e)">⌛</span>
                    {:else if student.status==='Inscrit(e)'}
                        <span data-tooltip="Inscrit(e)">✅</span>
                    {:else}
                        {student.status}
                    {/if}
                    </td>
                    <td><Boolean value={student.licence}/></td>
                    <td><Boolean value={student.payment}/></td>
                    <td><Boolean value={student.medicalCertificate}/></td>
                    <td>{getDayName(getDayFromUrl(student.seasons[seasons().current], $currentSeason.days))}</td>
                </tr>
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
</style>