<script>
    import AdultSubscriptionForm from "./AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./ChildSubscriptionForm.svelte"
    import DayForm from "./DayForm.svelte"
    import { currentSeason, currentDay } from '../../utilities/stores'
    import { isDayForAdults } from '../../utilities/days'

    let adult, lockedDay

    if($currentDay) lockedDay = $currentDay
    $:if($currentDay) adult = isDayForAdults($currentDay, $currentSeason.ageGroups)
    

  

    const handleSubmit = () => {
        console.log("ok")
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <DayForm {lockedDay}/> 
    {#if adult}
        <AdultSubscriptionForm />
    {:else}
        <ChildSubscriptionForm />
    {/if}
    <button>Submit</button>
</form>
