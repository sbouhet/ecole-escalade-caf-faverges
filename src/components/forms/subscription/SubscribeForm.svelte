<script>
    import AdultSubscriptionForm from "./adult/AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./child/ChildSubscriptionForm.svelte"
    import { currentSeason, currentDay, subscriptionStatus, subscription } from '$utils/stores'
    import { getDayName, isDayForAdults } from '$utils/days'
    import YearWarning from "./YearWarning.svelte"

    $:adult = isDayForAdults($currentDay, $currentSeason.ageGroups)
    $:$subscription.publicInfo.seasons[$currentSeason.name].adult = adult
    
    let ageConfirmed = adult ? false : true

    const handleSubmit = () => {
        $subscriptionStatus = 'readyToCheck'
    }
</script>


<form on:submit|preventDefault={handleSubmit}>

    <hgroup>
        <h1>{getDayName($currentDay)}</h1>
        <h1>Saison {$currentSeason.name}</h1>
    </hgroup>
    
    <YearWarning />

    {#if adult}
        <AdultSubscriptionForm bind:ageConfirmed/>
    {:else}
        <ChildSubscriptionForm />
    {/if}

    <button disabled={!ageConfirmed}>Valider</button>
</form>

<style>
    h1{
        text-transform: capitalize;
    }

    button{
        max-width: 250px;
    }
</style>