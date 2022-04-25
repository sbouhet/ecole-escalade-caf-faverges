<script>
    export let context //just to hide warning in console
    import SubscribeForm from '$components/forms/SubscribeForm.svelte'
    import CheckSubscription from '$components/CheckSubscription.svelte'
    import {params} from '@roxi/routify'
    import { currentSeason, currentDay, subscription, subscriptionStatus } from '$utils/stores'
    import { getDayFromUrl } from '$utils/days'
    import Success from '$components/Success.svelte'
    import { goto } from '@roxi/routify'
    import { subscriptionReset } from '$utils/subscriptionReset'

    //get day from url
    let dayUrl = $params.creneau

    //if there a day URL, set $currentDay
    if (dayUrl) {
        $currentDay = getDayFromUrl(dayUrl, $currentSeason.days)
    }

    //If status is NULL, reset subscription
    $:if(!$subscriptionStatus) $subscription = subscriptionReset()
    

    //If status is DONE, redirect to mon-compte
    $:if ($subscriptionStatus === 'done') $goto('/prive/mon-compte')
    
    
    /* let status
    $:status = $subscription.publicInfo.seasons[$currentSeason.name].status */
</script>

<article>
    <hgroup>
        <h1>Inscription</h1>
        <h1>Saison {$currentSeason.name}</h1>
    </hgroup>

    {#if $subscriptionStatus === 'readyToCheck'}
        <CheckSubscription />
    {:else if $subscriptionStatus === 'uploadedToFirestore'}
        <Success />
    {/if}

    <SubscribeForm />

</article>


<slot></slot> <!-- just to hide error warning in console -->
