<script>
    export let context
    import {_getDoc, _query} from "$firestore/basics"
    import { currentSeason, students,  } from '$utils/stores'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getAuth } from "firebase/auth"
    import StudentsStatusTable from '$components/tables/StudentsStatusTable.svelte'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'

    let error = null
    /* const getMyIds = httpsCallable(getFunctions(), 'getMyIds')

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
    } */


 /*    const getMyStudents = async()=>{
      const result = await _getDoc("users", getAuth().currentUser.uid)
      console.log(result.data())
      const myIds = result.data().students
      let myStudents = []
      for (const id of myIds) {
        const student = await _getDoc("students", id)
        myStudents.push(student)
      }
      console.log("Found "+ myStudents.length + " students")
      console.log(myStudents)
      return myStudents
    } */

    const getMyStudents = async()=>{
      const result = await _query("students", "parents", "array-contains", getAuth().currentUser.uid)
  
      return result
    }

    let myStudents = getMyStudents()
    //$:if($students.length) myStudents = getMyStudents($students)

    
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