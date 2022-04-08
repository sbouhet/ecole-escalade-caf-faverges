<script>
    import { db } from "$utils/firebase"
    import {collection,query,where,onSnapshot} from "firebase/firestore"
    import { getDayFromUrl, getDayName } from '$utils/days'
    import { currentSeason } from '$utils/stores'
    import StudentsStatusTable from '$components/StudentsStatusTable.svelte'
    import ErrorMessage from '$components/ErrorMessage.svelte'

    import {params} from '@roxi/routify'
    let dayUrl = $params.day
    let day = getDayFromUrl(dayUrl, $currentSeason.days)
    let name = getDayName(day)
    
    let students = []
    let error = null
    const q = query(collection(db, "students"), where(`seasons.${$currentSeason.name}.day`, "==", dayUrl))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        students = []
        querySnapshot.forEach((doc) => {
        students.push(doc.data())
        })
        console.log(`Found ${students.length} students for ${name}`)
    })
</script>

<h1>{name}</h1>

<StudentsStatusTable {students} showDay={false}/>

{#if error}
    <ErrorMessage {error}/>
{/if}

<style>
    h1{
        text-transform: capitalize;
    }
</style>