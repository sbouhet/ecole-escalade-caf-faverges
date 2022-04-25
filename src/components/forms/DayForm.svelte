<script>
    import {getDayName, getDayUrl} from '$utils/days'
    import { currentSeason, currentDay, subscription } from '$utils/stores'
    import { seasons } from '$utils/seasons'
    import {params} from '@roxi/routify'
    $:dayUrl = $params.creneau
    export let lockedDay
    let warningMessage

 /*    $:if ($currentDay) {
        warningMessage = getWarningMessage(getMinYear($currentDay, $currentSeason.ageGroups))
        $subscription.publicInfo.seasons[$currentSeason.name].day = getDayUrl($currentDay)
    } */

    if (lockedDay) {
        $currentDay = lockedDay
    }
   
</script>

<section>
    <label for="day">Créneau</label>
    <select id="day" required disabled={dayUrl} bind:value={$currentDay}>
        {#each $currentSeason.days as day }
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





