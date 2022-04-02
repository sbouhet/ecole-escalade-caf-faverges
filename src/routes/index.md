<script>
      export let context //just to hide warning in console
    import { db } from '../utilities/firebase'
    import { doc, getDoc } from "firebase/firestore"
    import Login from '../components/forms/Login.svelte'
    import CreateAccount from '../components/CreateAccount.svelte'
    import { getFunctions, httpsCallable } from "firebase/functions";

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

    


</script>

<!-- <CreateAccount/> -->

<!-- <Login /> -->

ACCUEIL

<a href="/prive/inscription">Inscription</a><br>
<a href="/prive/mon-compte">Mon compte</a><br>
<a href="/test">test</a><br><br>
<a href="/admin">ADMIN</a>
<slot></slot> <!-- just to hide error warning in console -->
