<script>
    import { getDayFromUrl, getDayName } from '$utils/days'
    import { currentSeason } from '$utils/stores'
    import StudentsStatusTable from '$components/StudentsStatusTable.svelte'
    import { getStudents } from '$utils/getStudents'

    import {params} from '@roxi/routify'
    let url = $params.day
    let day = getDayFromUrl(url, $currentSeason.days)
    let name = getDayName(day)
    let students = getStudents($currentSeason, url)
</script>

<h1>{name}</h1>

<StudentsStatusTable {students}/>