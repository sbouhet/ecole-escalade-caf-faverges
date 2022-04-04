<script>
    import { db } from "$utils/firebase"
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore"
    import { currentSeason, currentUser } from "$utils/stores"
    import Boolean from "$components/Boolean.svelte"
    import { deleteStudent } from '$utils/firestore'
    let students = []
    
    let admin = false
    if($currentUser.email==='friarobaz@gmail.com') admin = true

    const q = query(collection(db, "students"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        students = []
        querySnapshot.forEach((doc) => {
        students.push(doc.data())
        })
        console.log(`Found ${students.length} students for this query`)
    })
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
                    <th scope="col">Id</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Prénom</th>
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
                        <td class="del" on:click={()=>deleteStudent(student.id)}>X</td>
                    {/if}
                    <td>{student.id}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.status}</td>
                    <td><Boolean value={student.licence}/></td>
                    <td><Boolean value={student.payment}/></td>
                    <td><Boolean value={student.medicalCertificate}/></td>
                    <td>{student.years[$currentSeason.name]}</td>
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
</style>