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

  import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  getStorage,
  listAll,
  ref,
  getDownloadURL,
  getMetadata,
} from 'firebase/storage';




      const run = async()=>{
        
      
       console.log("lol");
      
    }
    

  const handleClick = async () => {
      console.log("clicked")
      run()
    
  }
</script>

<form on:submit|preventDefault={handleClick}>
 
 <button on:click|preventDefault={handleClick}>test</button> 
  
</form>


