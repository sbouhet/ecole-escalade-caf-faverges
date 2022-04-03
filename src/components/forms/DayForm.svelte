<script>
    import {getDayName, getDayUrl, getWarningMessage, getDayFromUrl, getMinYear} from '../../utilities/days'
    import { currentSeason, currentDay } from '../../utilities/stores'

    export let lockedDay
    let selectedDay, warningMessage
    $:season = $currentSeason
    $:day = $currentDay

    $:if (selectedDay) {
        warningMessage = getWarningMessage(getMinYear(selectedDay, season.ageGroups))
        $currentDay = selectedDay
    }

    if (lockedDay) {
        selectedDay = lockedDay
    }
   
</script>

<section>
    <label for="day">Créneau</label>
    <select id="day" required disabled={lockedDay} bind:value={selectedDay}>
        {#each season.days as day }
        <option value={day}>{getDayName(day)}</option>  
        {/each}
    </select>
    <span>ℹ</span>
    <small><i>{warningMessage}</i></small>
</section>


<style>
    span{
        margin-right: 5px;
        opacity: 0.5;
    }
</style>





