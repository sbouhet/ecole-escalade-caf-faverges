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
    import { getStudents } from '$utils/getStudents'
    import { currentSeason, currentUser } from '$utils/stores'
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
    $:if($currentUser){
      myStudents = students.filter(student => student.parents.some(p => p.email === $currentUser.email))
    }
    
    
</script>

<h2>Mes inscriptions</h2>
<StudentsStatusTable students={myStudents}/>
<hr>
<h2>Toutes les inscriptions en cours</h2>
<StudentsStatusTable {students}/>
