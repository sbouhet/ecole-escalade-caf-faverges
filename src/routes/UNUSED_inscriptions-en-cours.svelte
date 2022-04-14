<script>
    export let context
    import { db } from "$utils/firebase/firebase"
    import {collection,query,where,onSnapshot} from "firebase/firestore"
    import { currentSeason, loggedin } from '$utils/stores'
    import StudentsStatusTable from '$components/StudentsStatusTable.svelte'
    import { getMyStudents } from '$firestore/getMyStudents'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getAuth } from "firebase/auth"

    let students = []
    let error = null
    const q = query(collection(db, "students"), where(`seasons.${$currentSeason.name}.status`, ">", ""))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        students = []
        querySnapshot.forEach((doc) => {
        students.push(doc.data())
        })
        //console.log(`Found ${students.length} students for this season`)
    })

  let myStudents = getMyStudents($currentSeason)
  let searching = false

  const findStudentsWithMyEmailAndAddTheirIdsToMyUserDoc =
  httpsCallable(getFunctions(), 'findStudentsWithMyEmailAndAddTheirIdsToMyUserDoc')
  const findChildren = ()=>{
    searching = true
    console.log('Looking for students with email '+getAuth().currentUser.email)
    findStudentsWithMyEmailAndAddTheirIdsToMyUserDoc()
    .then(result => {
        console.log(result.data.message)
        getMyStudents($currentSeason).then(students=>{
          myStudents = students
          searching = false
        }).catch(err=>{
          error = err
          console.error(err)
        })
      }).catch((err)=>{
        error = err
        console.error(err)
      })
  }
    
</script>
{#if $loggedin}
  <h2>Mes inscriptions</h2>
  {#await myStudents}
    Merci de patienter...
  {:then myStudents} 
  <div>
    {#if searching}
    <p>Recherche d'élèves inscrits avec l'email {getAuth().currentUser.email}</p>
    <p>Merci de patienter...</p>
    {:else}
      <a href="#" on:click={findChildren} data-tooltip={`Chercher un inscrit avec l'email ${getAuth().currentUser.email}`}>
        Trouver mes enfants déjà inscrits
      </a>
    {/if}
    <ErrorMessage {error}/>
  </div>
  <br>
    <StudentsStatusTable students={myStudents} allowDelete={false}/>
  {:catch}
    <ErrorMessage error='Erreur : inscriptions non trouvées.'/>
  {/await}
  <hr>
{/if}

<hgroup>
  <h2>Toutes les inscriptions en cours</h2>
  <h5>{students.length} inscrits pour l'instant</h5>
</hgroup>

{#if students.length>0}
  <small>Cliquez sur une colone pour trier les données</small>
{/if}
<StudentsStatusTable {students} allowDelete={true}/>


<slot></slot>