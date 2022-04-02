<script>
/*     export let context //just to hide warning in console

    import { db } from '../utilities/firebase'
    import { doc, getDoc} from "firebase/firestore"
    import { seasons } from '../utilities/seasons'
    import { currentSeason } from '../utilities/stores'


   const getCurrentSeason = async () => {
        const docRef = doc(db, "years", seasons().current)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return docSnap.data()
        }
        throw "Current season not found"
    }
    
   let season = $currentSeason || getCurrentSeason() */
    
    
</script>


<!-- {#await season}

	<h2>attente de SEASON</h2>
{:then}
{season}
    <slot></slot>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}

 -->

    <slot></slot>
