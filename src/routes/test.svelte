<script>
    import { db } from "$utils/firebase"
    import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collectionGroup,
  collection,
  query,
  where,
  onSnapshot,
    } from "firebase/firestore"
    import { getApp } from "firebase/app";
    import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { getStudents } from '$utils/getStudents'
    import { currentSeason } from '$utils/stores'
    import StudentsStatusTable from '$components/StudentsStatusTable.svelte'
    import { seasons } from '$utils/seasons'

    const functions = getFunctions(getApp())
    //connectFunctionsEmulator(functions, "localhost", 5001);

    let privateData

    const getData = async(docRefs)=>{
        //const docRef = doc(db, "students", "Nk8d10RMy8cWLFS5TETp", "privateCol", "privateDoc");
        console.log(docRefs)
        for (const ref of docRefs) {
            console.log(ref)
            const docSnap = getDoc(ref).then(snap=>{
            console.log(snap.data())
          })
        }
       
    }

const getEmails = (studentPrivateData)=>{
  let emails = []
  let data = privateData
  if(!data) throw "no data"
  if(data.email) emails.push(data.email)
  if (data.parents && data.parents.length) {//if parents
        console.log(`Found ${data.parents.length} parents`)
      for (const parent of data.parents) {
          if(parent.email)emails.push(parent.email)
      }
  }
  console.log(emails)
  return emails
}

//const functions = getFunctions()

const findChildren = httpsCallable(functions, 'findChildren')
const sayHello = httpsCallable(functions, 'sayHello')
const test = httpsCallable(functions, 'test')

let docRefs = []
const handelGetChildren = () => {
    console.log("clicked")
   test({ email: 'friarobaz@gmail.com' }).then(result => {
    const childrenIds = result.data.childrenIds
    console.log(childrenIds)
  })
}

const handleClick = () => {
    console.log("clicked")
    sayHello({name: 'Jules'}).then(result => {
            console.log(result.data)
    })        
}
    
</script>

{#if privateData}
    {privateData.dateOfBirth}
{/if}

<!-- <button on:click={getData}>Get private data</button> -->
<button on:click={getEmails}>Get emails</button>
<button on:click={handelGetChildren}>Get children</button>
<button on:click={handleClick}>Hello</button>
