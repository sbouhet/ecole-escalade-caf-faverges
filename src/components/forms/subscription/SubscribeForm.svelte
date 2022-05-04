<script>
    import AdultSubscriptionForm from "./adult/AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./child/ChildSubscriptionForm.svelte"
    import { currentSeason, currentDay, subscriptionStatus, subscription } from '$utils/stores'
    import { getDayName, isDayForAdults } from '$utils/days'
    import YearWarning from "./YearWarning.svelte"
import InfoMessage from "./InfoMessage.svelte"

    $:adult = isDayForAdults($currentDay, $currentSeason.ageGroups)
    $:$subscription.publicInfo.seasons[$currentSeason.name].adult = adult
    
    //Force adult users to check switch "Je suis majeur"
    $:ageConfirmed = adult ? false : true
    //This is only used for adults, "ageConfirmed" stays true for children
    //For children, DateOfBirth component handles the age check 

    //Check if everyone should be able to subscribe or only past students
    const today = dayjs()
    const dateOfNoRestriction = dayjs($currentSeason.dateOfNoRestriction)
    const timeUntilNoRestrictions = dateOfNoRestriction.diff(today)
    const pastStudentsOnly = timeUntilNoRestrictions>0

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
    {#if pastStudentsOnly}
        <InfoMessage msg="Inscriptions limitées aux élèves inscrits l'année dernière jusqu'au {dateOfNoRestriction.format('D MMMM YYYY')}" />
    {/if}

    {#if adult}
        <AdultSubscriptionForm bind:ageConfirmed {pastStudentsOnly}/>
    {:else}
        <ChildSubscriptionForm {pastStudentsOnly}/>
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