<script>
    import {_getDoc}from '$firestore/basics'
    import {currentSeason} from '$utils/stores'
    import NameFormNoRestriction from './NameFormNoRestriction.svelte'
    import NameFormWithRestriction from './NameFormWithRestriction.svelte'
    export let firstName, lastName
   
    const today = dayjs()
    const dateOfNoRestriction = dayjs($currentSeason.dateOfNoRestriction)
    const timeUntilNoRestrictions = dateOfNoRestriction.diff(today)
</script>

{#if timeUntilNoRestrictions>0}
    <i>Inscriptions limitées aux élèves inscrits l'année dernière jusqu'au {dateOfNoRestriction.format("D MMMM YYYY")}</i>
    <br><br>
    <NameFormWithRestriction bind:firstName bind:lastName />
{:else}
    <NameFormNoRestriction bind:firstName bind:lastName />
{/if}