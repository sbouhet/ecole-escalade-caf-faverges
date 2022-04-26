<script>
    export let context
    import { db } from "$utils/firebase/firebase"
    import {collection,query,where,onSnapshot} from "firebase/firestore"
    import { currentSeason, loggedin } from '$utils/stores'
    import StudentsStatusTable from '$components/tables/StudentsStatusTable.svelte'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getAuth } from "firebase/auth"

    let students = []
    const q = query(collection(db, "students"), where(`seasons.${$currentSeason.name}.status`, ">", ""))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        students = []
        querySnapshot.forEach((doc) => {
        students.push(doc.data())
        })
        //console.log(`Found ${students.length} students for this season`)
    })

</script>

<hgroup>
  <h2>Toutes les inscriptions en cours</h2>
  <h5>{students.length} inscrits pour l'instant</h5>
</hgroup>

{#if students.length>0}
  <small>Cliquez sur une colone pour trier les données</small>
{/if}
<StudentsStatusTable {students} allowDelete={true} links={true}/>

<slot></slot>