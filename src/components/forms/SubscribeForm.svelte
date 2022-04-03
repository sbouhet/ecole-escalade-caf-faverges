<script>
    import AdultSubscriptionForm from "./AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./ChildSubscriptionForm.svelte"
    import DayForm from "./DayForm.svelte"
    import { currentSeason, currentDay, subscription } from '$utils/stores'
    import { isDayForAdults } from '$utils/days'

    let adult, lockedDay

    if($currentDay) lockedDay = $currentDay
    $:if($currentDay) adult = isDayForAdults($currentDay, $currentSeason.ageGroups)
    
    export let submitted
  

    const handleSubmit = () => {
        if (!$subscription.ageChecksOut) {
            console.error('age does not match day')
            alert("L'age de votre enfant ne correspond pas au groupe choisi")
            return
        }
        submitted = true
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
