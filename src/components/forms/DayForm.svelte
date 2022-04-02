<script>
    import {getDayName, getDayUrl, getWarningMessage, getDayFromUrl} from '../../utilities/days'
    import { currentSeason } from '../../utilities/stores'

    export let dayUrl
    let selectedDay
    let season = $currentSeason
    let warningMessage
    $:if (selectedDay) {
        warningMessage = getWarningMessage(selectedDay, season.ageGroups)
    }

    if (dayUrl) {
        selectedDay = getDayFromUrl(dayUrl, season.days)
    }
   
</script>

<section>
    <label for="day">Créneau</label>
    <select id="day" required disabled={dayUrl} bind:value={selectedDay}>
        {#each season.days as day }
        <option value={day}>{getDayName(day)}</option>  
        {/each}
    </select>
    <small>{warningMessage}</small>
</section>


   





