<script>
    import { db } from '../utilities/firebase'
    import { doc, getDoc } from "firebase/firestore"
    import Login from '../components/Login.svelte'
    import CreateAccount from '../components/CreateAccount.svelte'
    import { getFunctions, httpsCallable } from "firebase/functions";


 
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

    const functions = getFunctions()
    const sayHello = httpsCallable(functions, 'sayHello')

    const handleClick = () => {
        console.log("clicked")
        sayHello({name: 'Jules'}).then(result => {
            console.log(result.data)
        })
        
    }

    


</script>

LOLOL
<button on:click|preventDefault={handleClick}>Say hello</button>

<!-- <Login /> -->
