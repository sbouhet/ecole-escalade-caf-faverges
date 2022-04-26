<script>
    import AdultSubscriptionForm from "./AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./ChildSubscriptionForm.svelte"
    import { currentSeason, currentDay, subscriptionStatus } from '$utils/stores'
    import { getDayName, isDayForAdults } from '$utils/days'
    import YearWarning from "./YearWarning.svelte"

    const day = $currentDay
    const adult = isDayForAdults(day, $currentSeason.ageGroups)


    const handleSubmit = () => {
        $subscriptionStatus = 'readyToCheck'
    }
</script>


<form on:submit|preventDefault={handleSubmit}>

    <hgroup>
        <h1>{getDayName(day)}</h1>
        <h1>Saison {$currentSeason.name}</h1>
    </hgroup>
    
    <YearWarning />

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