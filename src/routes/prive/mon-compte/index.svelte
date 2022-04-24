<script>
    export let context
    import { currentSeason, students,  } from '$utils/stores'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getAuth } from "firebase/auth"
    import StudentsStatusTable from '$components/StudentsStatusTable.svelte'
    import ErrorMessage from '$components/ErrorMessage.svelte'

    let error = null
    const getMyIds = httpsCallable(getFunctions(), 'getMyIds')

    const getMyStudents = async(students)=>{
      let response = await getMyIds()
      console.log(response)
    
      if (response.data.statusCode === 200) {
        const myIds = response.data.body.myIds
        const myStudents = students.filter(x=>myIds.includes(x.id))
        return myStudents
      } else {
        console.log(response)
        error = response.data.message
        return
      }
    }
    let myStudents = []
    $:if($students.length) myStudents = getMyStudents($students)
    
</script>

<h2>Mes inscriptions</h2>
{#await myStudents}
  <p aria-busy="true">
    Merci de patienter...
  </p>
{:then myStudents} 
    
    <p>Cliquez sur une inscription pour plus de détails.</p>
    <br>
    <StudentsStatusTable students={myStudents} allowDelete={false} myProfile={true}/>
{:catch}
    <ErrorMessage error='inscriptions non trouvées.'/>
{/await}



<slot></slot>