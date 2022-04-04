<script>
    import { getStudents } from '$utils/getStudents'
    import { currentSeason } from '$utils/stores'

    const test = ()=>{
        let students = getStudents($currentSeason, 'lundi-17h')
        //console.log(students)
    }
    
</script>

<button on:click={test}>Get students</button>