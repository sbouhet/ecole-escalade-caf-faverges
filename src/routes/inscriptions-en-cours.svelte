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
        import { getAuth } from "firebase/auth"


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

  const getMyStudents = async()=>{
    let myStudents = []
    let currentUser = getAuth().currentUser
    const userRef = doc(db, "users", currentUser.uid)
    const userSnap = await getDoc(userRef)
    let ids = userSnap.data().students
    console.log(ids)
    for (const id of ids) {
      const studentRef = doc(db, "students", id)
      const studentSnap = await getDoc(studentRef)
      myStudents.push(studentSnap.data())
    }
    console.log(myStudents)
    return myStudents
  }




    const myStudents = getMyStudents()


   /*  $:if($currentUser){
      myStudents = students.filter(student => student.parents.some(p => p.email === $currentUser.email))
    } */
    
    
</script>
{#if $loggedin}
  <h2>Mes inscriptions</h2>
  {#await myStudents}
    please wait...
  {:then myStudents} 
  <StudentsStatusTable students={myStudents}/>
  {/await}
  <hr>
{/if}

<h2>Toutes les inscriptions en cours</h2>
<p>Cliquez sur une colone pour trier les données</p>
<StudentsStatusTable {students}/>
