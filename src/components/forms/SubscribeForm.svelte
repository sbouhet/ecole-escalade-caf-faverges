<script>
    import AdultSubscriptionForm from "./AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./ChildSubscriptionForm.svelte"
    import DayForm from "./DayForm.svelte"
    import { currentSeason, currentDay, subscription, ageStatus } from '$utils/stores'
    import { getDayName, isDayForAdults } from '$utils/days'
    import WrongAgeModal from '$components/WrongAgeModal.svelte'
    import { seasons } from '$utils/seasons'

    let adult, lockedDay
    let openErrorModal = false
    export let day

    if($currentDay) lockedDay = $currentDay
    $:if($currentDay) adult = isDayForAdults($currentDay, $currentSeason.ageGroups)
    

    const handleSubmit = () => {
        if (openErrorModal) return
        if ($ageStatus!=='ok') {
            console.error('age does not match day')
            openErrorModal = true
            return
        }
        $subscription.publicInfo.seasons[$currentSeason.name].status = 'readyToCheck'
    }
    $:console.log($subscription)
</script>

<WrongAgeModal bind:open={openErrorModal}/>

<form on:submit|preventDefault={handleSubmit}>
    <hgroup>
        {#if !day}
            <h1>Inscription</h1>
        {:else}
            <h1>{getDayName(day)}</h1>
        {/if}
        <h1>Saison {$currentSeason.name}</h1>
    </hgroup>
    {#if !day}
        <DayForm />
    {/if}
    {#if adult}
        <AdultSubscriptionForm />
    {:else}
        <ChildSubscriptionForm />
    {/if}
    <button>Valider</button>
</form>

<style>
    h1{
        text-transform: capitalize;
    }
</style>