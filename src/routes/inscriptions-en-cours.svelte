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
    import { currentSeason, currentUser, loggedin } from '$utils/stores'
    import StudentsStatusTable from '$components/StudentsStatusTable.svelte'
    import { seasons } from '$utils/seasons'

    let students = []
    const q = query(collection(db, "students"), where(`seasons.${seasons().current}.status`, ">", ""))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        students = []
        querySnapshot.forEach((doc) => {
        students.push(doc.data())
        })
        console.log(students)
        console.log(`Found ${students.length} students for this query`)
    })




    let myStudents = []
    const privateQuery = query(collectionGroup(db, 'privateCol'), where('email', '==', 'friarobaz@gmail.com'));
    const unsubscribe2 = onSnapshot(privateQuery, (querySnapshot) => {
        myStudents = []
        querySnapshot.forEach((doc) => {
        myStudents.push(doc.data())
        })
        console.log(myStudents)
        console.log(`Found ${myStudents.length} students for this query`)
    })






   /*  $:if($currentUser){
      myStudents = students.filter(student => student.parents.some(p => p.email === $currentUser.email))
    } */
    
    
</script>
{#if $loggedin}
  <h2>Mes inscriptions</h2>
  <StudentsStatusTable students={myStudents}/>
  <hr>
{/if}

<h2>Toutes les inscriptions en cours</h2>
<p>Cliquez sur une colone pour trier les données</p>
<StudentsStatusTable {students}/>
