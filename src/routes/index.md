<script>
    import { db } from '../utilities/firebase'
    import { doc, getDoc } from "firebase/firestore"
    import Login from '../components/Login.svelte'
    import CreateAccount from '../components/CreateAccount.svelte'


 
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

LOLOL

<Login />
