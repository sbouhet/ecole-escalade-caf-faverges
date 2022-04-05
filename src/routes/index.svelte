<script>
      export let context //just to hide warning in console
    import { db } from '$utils/firebase'
    import { doc, getDoc } from "firebase/firestore"
    import Login from '$components/forms/Login.svelte'
    import CreateAccount from '$components/CreateAccount.svelte'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { subscription, currentDay } from '$utils/stores'
    import { subscriptionReset } from '$utils/subscriptionReset'
    import { seasons } from '$utils/seasons'

/* 

 const test = async ()=>{
        const students = collection(db, "students")
        const q = query(students, where("emails", "array-contains", "friarobaz@gmail.com"))
        
        try {
            const querySnapshot = await getDocs(q)
            let result = []
            querySnapshot.forEach((doc) => {
                result.push(doc.data())
            })
            console.log('Success')
            console.log(result[0])
            return result[0]
            
        } catch (error) {
            throw error
        }
    }






 
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

const reset = ()=>{
    $subscription = subscriptionReset()
    $currentDay = null
}


</script>

<!-- <CreateAccount/> -->

<!-- <Login /> -->

<hgroup>
    <h1>École d'escalade</h1>
    <h1>Saison {seasons().current}</h1>
</hgroup>


<a href="/prive/inscription" on:click={reset}>Inscription</a><br>
<a href="/prive/mon-compte">Mon compte</a><br>
<a href="/inscriptions-en-cours">Voir les inscriptions en cours</a><br><br>
<a href="/test">test</a><br>
<a href="/admin">ADMIN</a>
<slot></slot> <!-- just to hide error warning in console -->
