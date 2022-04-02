<script>
    import { firebaseApp } from '../utilities/firebase' //important, do not remove
    export let context //just to hide warning in console

    import { season } from '../utilities/stores'
    import { db } from '../utilities/firebase'
    import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
    import {seasons} from '../utilities/seasons'


   const getCurrentSeason = async () => {
        const docRef = doc(db, "years", seasons().current)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return docSnap.data()
        }
        throw "Current season not found"
    }
    
   let currentSeason = $season || getCurrentSeason()
    
    
</script>


{#await currentSeason}
	<h2>attente de SEASON</h2>
{:then}
    <slot></slot>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}


