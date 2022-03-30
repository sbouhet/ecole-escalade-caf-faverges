<script>
    import { db } from '../utilities/firebase'
    import { doc, getDoc } from "firebase/firestore"

    
 
    const test = async () => {
        const docRef = doc(db, "admin", "2022-2023")
        const docSnap = await getDoc(docRef)
        let info
        if (docSnap.exists()) {
            info = docSnap.data()
        }
        console.log(info)
    }

    test()


</script>

TEST Jules
