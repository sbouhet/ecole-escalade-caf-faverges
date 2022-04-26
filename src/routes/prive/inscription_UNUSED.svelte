<script>
    export let context //just to hide warning in console
    import SubscribeForm from '$components/forms/subscription/SubscribeForm.svelte'
    import CheckSubscription from '$components/modals/CheckSubscription.svelte'
    import {params} from '@roxi/routify'
    import { currentSeason, currentDay, subscription, subscriptionStatus, error, fatal } from '$utils/stores'
    import { getDayFromUrl, getDayName } from '$utils/days'
    import Success from '$components/modals/Success.svelte'
    import { goto } from '@roxi/routify'
    import { subscriptionReset } from '$utils/subscriptionReset'
    import { BError } from 'berror'

    //get day from url
    let dayUrl = $params.creneau

    //if there a day URL, try to find corresponding day in current season
    let day
    if (dayUrl){
        try {
            day = getDayFromUrl(dayUrl, $currentSeason.days)
        } catch (err) {
            const e = new BError(`Could not find day with url ${dayUrl}`, err, {days:$currentSeason.days})
            e.log()
            $error = e
            $fatal = true
        }
    }

    //If status is NULL, reset subscription
    $:if(!$subscriptionStatus) $subscription = subscriptionReset($currentSeason)
    

    //If status is DONE, redirect to mon-compte
    $:if ($subscriptionStatus === 'done') $goto('/prive/mon-compte')
    
    
    /* let status
    $:status = $subscription.publicInfo.seasons[$currentSeason.name].status */
</script>

<article>
    <hgroup>
        {#if !day}
            <h1>Inscription</h1>
        {:else}
            <h1>{getDayName(day)}</h1>
        {/if}
        <h1>Saison {$currentSeason.name}</h1>
    </hgroup>

    {#if $subscriptionStatus === 'readyToCheck'}
        <CheckSubscription />
    {:else if $subscriptionStatus === 'uploadedToFirestore'}
        <Success />
    {:else}
        <SubscribeForm {day}/>
    {/if}

</article>


<slot></slot> <!-- just to hide error warning in console -->

<style>
    h1{
        text-transform: capitalize;
    }
</style>
