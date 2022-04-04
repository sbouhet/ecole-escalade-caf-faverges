<script>
    import { db } from '$utils/firebase'
    import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
    import { goto } from '@roxi/routify'
/*     export let context //just to hide warning in console

    import {days} from '$utils/days'
    import {ageGroups} from '$utils/ageGroups'



    const test = async() => {
        const season = doc(db, "years", "2022-2023")
        await updateDoc(season, {
            name: "2021-2022",
            days,
            ageGroups
        })
    } */
    

/* const test = async()=>{
    const q = query(collection(db, "students"))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((student) => {
     deleteDoc(doc(db, "students", student.id));
    })
} */

/* const test = ()=>{
    $goto('/prive/mon-compte')
} */
</script>

<button on:click|preventDefault={test}>TEST</button>
