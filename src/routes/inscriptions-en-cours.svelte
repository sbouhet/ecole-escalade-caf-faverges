<script>
    import { db } from "$utils/firebase"
    import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collectionGroup,
  collection,
  query,
  where,
  onSnapshot,
    } from "firebase/firestore"
    import { getStudents } from '$utils/getStudents'
    import { currentSeason, loggedin } from '$utils/stores'
    import StudentsStatusTable from '$components/StudentsStatusTable.svelte'
    import { seasons } from '$utils/seasons'
    import { getAuth } from "firebase/auth"
    import { getMyStudents } from '$utils/firestore'
    import ErrorMessage from '$components/ErrorMessage.svelte'


    let students = []
    const q = query(collection(db, "students"), where(`seasons.${$currentSeason.name}.status`, ">", ""))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        students = []
        querySnapshot.forEach((doc) => {
        students.push(doc.data())
        })
        console.log(`Found ${students.length} students for this season`)
    })

  const myStudents = getMyStudents($currentSeason)
    
</script>
{#if $loggedin}
  <h2>Mes inscriptions</h2>
  {#await myStudents}
    Merci de patienter...
  {:then myStudents} 
    <StudentsStatusTable students={myStudents}/>
  {:catch}
    <ErrorMessage error='Erreur : inscriptions non trouvées.'/>
  {/await}
  <hr>
{/if}

<h2>Toutes les inscriptions en cours</h2>
<p>Cliquez sur une colone pour trier les données</p>
<StudentsStatusTable {students}/>
