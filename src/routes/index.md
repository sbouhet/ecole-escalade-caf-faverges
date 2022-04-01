<script>
      export let context //just to hide warning in console
    import { db } from '../utilities/firebase'
    import { doc, getDoc } from "firebase/firestore"
    import Login from '../components/forms/Login.svelte'
    import CreateAccount from '../components/CreateAccount.svelte'
    import { getFunctions, httpsCallable } from "firebase/functions";

/* 
 
    const test = async () => {
        const docRef = doc(db, "admin", "2022-2023")
        const docSnap = await getDoc(docRef)
        let info
        if (docSnap.exists()) {
            info = docSnap.data()
        }
        console.log(info)
    }


    const functions = getFunctions()
    const sayHello = httpsCallable(functions, 'sayHello')

    const handleClick = () => {
        console.log("clicked")
        sayHello({name: 'Jules'}).then(result => {
            console.log(result.data)
        })
        
    } */

    


</script>

<!-- <CreateAccount/> -->

<!-- <Login /> -->

ACCUEIL

<a href="/inscription">Inscription</a>
<slot></slot> <!-- just to hide error warning in console -->
