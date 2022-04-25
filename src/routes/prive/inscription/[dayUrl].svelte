<script>
    /* -------------------------------------------------------------------
    This page tries to find a day object based on url and $currentSeason
    Then it displays differents components based on the value of $subscriptionStatus

    status is NULL    >    reset $subsrciption and show <SubscribeForm>
    status is DONE    >    redirect to mon-compte
    status is READY TO CHECK    >    show <CheckSubscription>
    status is UPLOADED TO FIRESTORE    >    show <Success>
    -------------------------------------------------------------------  */
    export let context //just to hide warning in console
    import SubscribeForm from '$components/forms/SubscribeForm.svelte'
    import CheckSubscription from '$components/CheckSubscription.svelte'
    import {params} from '@roxi/routify'
    import { currentSeason, subscription, subscriptionStatus, error, fatal } from '$utils/stores'
    import { getDayFromUrl } from '$utils/days'
    import Success from '$components/Success.svelte'
    import { goto } from '@roxi/routify'
    import { subscriptionReset } from '$utils/subscriptionReset'
    import { BError } from 'berror'

    //get day from url
    let dayUrl = $params.dayUrl

    //Try to find corresponding day in current season
    let day
    try {
        day = getDayFromUrl(dayUrl, $currentSeason.days)
    } catch (err) {
        const e = new BError(`Could not find day with url ${dayUrl}`, err, {days:$currentSeason.days})
        e.log()
        $error = e
        $fatal = true
    }

    //If status is NULL, reset subscription
    $:if(!$subscriptionStatus) $subscription = subscriptionReset($currentSeason)
    

    //If status is DONE, redirect to mon-compte
    $:if ($subscriptionStatus === 'done') $goto('/prive/mon-compte')
    
</script>

<article>

    {#if $subscriptionStatus === 'readyToCheck'}
        <CheckSubscription />
    {:else if $subscriptionStatus === 'uploadedToFirestore'}
        <Success />
    {:else}
        <SubscribeForm {day}/>
        <!-- day should never be undefined, otherwise error is thrown above -->
    {/if}

</article>


<slot></slot> <!-- just to hide error warning in console -->

