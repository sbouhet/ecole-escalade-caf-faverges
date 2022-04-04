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

    let students = []
    const q = query(collection(db, "students"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        students = []
        querySnapshot.forEach((doc) => {
        students.push(doc.data())
        })
        console.log(`Found ${students.length} students for this query`)
    })

    
</script>

<StudentsStatusTable {students}/>
