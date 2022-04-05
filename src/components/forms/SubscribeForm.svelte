<script>
    import AdultSubscriptionForm from "./AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./ChildSubscriptionForm.svelte"
    import DayForm from "./DayForm.svelte"
    import { currentSeason, currentDay, subscription, ageStatus } from '$utils/stores'
    import { isDayForAdults } from '$utils/days'
    import WrongAgeModal from '$components/WrongAgeModal.svelte'
    import { seasons } from '$utils/seasons'

    let adult, lockedDay
    let openErrorModal = false

    if($currentDay) lockedDay = $currentDay
    $:if($currentDay) adult = isDayForAdults($currentDay, $currentSeason.ageGroups)
    

    const handleSubmit = () => {
        if (openErrorModal) return
        if ($ageStatus!=='ok') {
            console.error('age does not match day')
            openErrorModal = true
            return
        }
        $subscription.seasons[seasons().current].status = 'readyToCheck'
    }
</script>

<WrongAgeModal bind:open={openErrorModal}/>

<form on:submit|preventDefault={handleSubmit}>
    <DayForm {lockedDay}/> 
    {#if adult}
        <AdultSubscriptionForm />
    {:else}
        <ChildSubscriptionForm />
    {/if}
    <button>Valider</button>
</form>
