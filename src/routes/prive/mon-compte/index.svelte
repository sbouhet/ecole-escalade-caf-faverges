<script>
    export let context
    import { currentSeason,  } from '$utils/stores'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getAuth } from "firebase/auth"
    import StudentsStatusTable from '$components/StudentsStatusTable.svelte'
    import ErrorMessage from '$components/ErrorMessage.svelte'

    let error = null
  const getMyStudents = httpsCallable(getFunctions(), 'getMyStudents')
  let myStudents = []
  const run = async()=>{
    let response = await getMyStudents()
    console.log(response)
    if (response.data.statusCode === 200) {
      myStudents = response.data.body.myStudents
    } else {
      console.log("Une erreur est survenu")
      console.log(response)
      error = response.data.message
      return
    }
  }
  run()

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

<h2>Mes inscriptions</h2>
{#await myStudents}
<p aria-busy="true">
  Merci de patienter...
</p>
{:then myStudents} 
    <div>
        {#if searching}
        <p>Recherche d'élèves inscrits avec l'email {getAuth().currentUser.email}</p>
        <p aria-busy="true">Merci de patienter...</p>
        {:else}
        <a href="#" on:click={findChildren} data-tooltip={`Chercher un inscrit avec l'email ${getAuth().currentUser.email}`}>
            Trouver mes enfants déjà inscrits
        </a>
        {/if}
        <ErrorMessage {error}/>
    </div>
    <p>Cliquez sur une inscription pour plus de détails.</p>
    <br>
    <StudentsStatusTable students={myStudents} allowDelete={false} myProfile={true}/>
{:catch}
    <ErrorMessage error='Erreur : inscriptions non trouvées.'/>
{/await}



<slot></slot>