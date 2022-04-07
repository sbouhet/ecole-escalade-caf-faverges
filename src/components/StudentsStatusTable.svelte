<!-- routify:meta reset -->
<script>
    import { currentSeason } from "$utils/stores"
    import { getDayName, getDayFromUrl} from '$utils/days'
    import Boolean from "$components/Boolean.svelte"
    import { deleteStudent } from '$utils/firestore'
    import { capitalize } from '$utils/capitalize'
    import { getAuth } from "firebase/auth"
    export let students = []
    
    let admin = false
    if(getAuth().currentUser && getAuth().currentUser.email==='friarobaz@gmail.com') admin = true
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
                    <!-- {#if admin}<th scope="col">E‑mail</th>{/if} -->
                    <th scope="col">Créneau</th>
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
                    {#if admin}
                        <td class="del" on:click={()=>deleteStudent(student.id)}>🗑</td>
                    {/if}
                    <!-- <td>{student.id}</td> -->
                    <td>{capitalize(student.firstName)}</td>
                    <td>{student.lastName.toUpperCase()}</td>
                   <!--  {#if admin}
                        <td>{student.parents[0].email}</td>
                    {/if} -->
                    <td>{getDayName(getDayFromUrl(student.seasons[$currentSeason.name].day, $currentSeason.days))}</td>
                    <td>{#if student.seasons[$currentSeason.name].status==='Pré‑inscrit(e)'}
                        <span data-tooltip="Pré‑inscrit(e), le dossier n'est pas complet.">⌛</span>
                        {:else if student.seasons[$currentSeason.name].status==='Inscrit(e)'}
                        <span data-tooltip="Inscrit(e)">✅</span>
                        {:else}
                        {student.seasons[$currentSeason.name].status}
                        {/if}
                    </td>
                    <td><Boolean value={student.licence}/></td>
                    <td><Boolean value={student.payment}/></td>
                    <td><Boolean value={student.medicalCertificate}/></td>
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
</style>