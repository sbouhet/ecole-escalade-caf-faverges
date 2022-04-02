<script>
    export let context //just to hide warning in console

    import { db } from '../utilities/firebase'
    import { doc, updateDoc} from "firebase/firestore"
    import {days} from '../utilities/days'
    import {ageGroups} from '../utilities/ageGroups'



    const test = async() => {
        const season = doc(db, "years", "2022-2023")
        await updateDoc(season, {
            name: "2021-2022",
            days,
            ageGroups
        })
    }
</script>

<button on:click|preventDefault={test}>TEST</button>
