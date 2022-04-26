<script>
    import { db } from "$utils/firebase/firebase"
    import {

  getDoc,

    } from "firebase/firestore"
    import { getApp } from "firebase/app";
    import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { currentSeason } from '$utils/stores'
    import StudentsStatusTable from '$components/tables/StudentsStatusTable.svelte'
    import { seasons } from '$utils/seasons'
import { normalize } from "$utils/normalize"
import {isUserInHelloAsso} from '$utils/helloAsso'

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
const getUser = httpsCallable(functions, 'getUser')
const deleteClaims = httpsCallable(functions, 'deleteClaims')

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

const handleItems = async ()=>{
  
  console.log("searching")
  const result = await isUserInHelloAsso("juldés", "marçhand")
  console.log(result)
}
const handleGetUser = async ()=>{
  console.log("searching")
  const result = await getUser({id: '742120209004'})
  const user = result.data
  console.log(user)
}
 const handleDeleteClaims = async ()=>{
  console.log("searching")
  const result = await deleteClaims({userId: 'userIdamettreici'})
  console.log(result)
}       
</script>

{#if privateData}
    {privateData.dateOfBirth}
{/if}

<!-- <button on:click={getData}>Get private data</button> -->
<button on:click={getEmails}>Get emails</button>
<button on:click={handelGetChildren}>Get children</button>
<button on:click={handleClick}>Hello</button>
<button on:click={handleItems}>getItemsFromHelloAsso</button>
<button on:click={handleGetUser}>getUser from SOAP</button>
<button on:click={handleDeleteClaims}>Delete claims</button>

