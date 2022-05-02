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
  import { _addDoc, _setDoc } from "$firestore/basics"
  import {_query}from '$firestore/basics'

    const functions = getFunctions(getApp())
    //const deleteClaims = httpsCallable(functions, 'deleteClaims')

    let firstName, lastName

      const run = async()=>{

        const priorityStudents = await _query("tmp", "firstName", ">", '')
        const data = priorityStudents.map(x=>x.data())
        console.log(data)
        return {priorityStudents:data}
      
    }
    run()

  const handleClick = async () => {
      console.log("clicked")
      const obj = await run()
      await _setDoc(obj, "tmp", "all")  
      firstName = ''
      lastName = ''
      console.log('done')
  }
</script>

<form on:submit|preventDefault={handleClick}>
  <input type="text" bind:value={firstName} required>
  <input type="text" bind:value={lastName} required>
  <!-- <button on:click|preventDefault={handleClick}>test</button> -->
  <button>OK</button>
</form>


