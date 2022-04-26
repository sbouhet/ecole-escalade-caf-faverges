<script>
    /* -------------------------------------------------------------------
    This page tries to find a day object based on url and $currentSeason
    Stores it in $currentDay
    Then it displays differents components based on the value of $subscriptionStatus

    status is NULL    >    reset $subsrciption and show <SubscribeForm>
    status is DONE    >    redirect to mon-compte
    status is READY TO CHECK    >    show <CheckSubscription>
    status is UPLOADED TO FIRESTORE    >    show <Success>
    -------------------------------------------------------------------  */
    export let context //just to hide warning in console
    import SubscribeForm from '$components/forms/subscription/SubscribeForm.svelte'
    import CheckSubscription from '$components/CheckSubscription.svelte'
    import {params} from '@roxi/routify'
    import { currentSeason, subscription, subscriptionStatus, error, fatal, currentDay } from '$utils/stores'
    import { getDayFromUrl } from '$utils/days'
    import Success from '$components/Success.svelte'
    import { goto } from '@roxi/routify'
    import { subscriptionReset } from '$utils/subscriptionReset'
    import { BError } from 'berror'
    import ErrorMessage from '$components/ErrorMessage.svelte'

    //get day from url
    let dayUrl = $params.dayUrl

    //Try to find corresponding day in current season
    try {
        $currentDay = getDayFromUrl(dayUrl, $currentSeason.days)

        // Write day URL in subscription
        $subscription.publicInfo.seasons[$currentSeason.name].day = dayUrl

        } catch (err) {
        const e = new BError(`Could not find day with url ${dayUrl}`, err, {days:$currentSeason.days})
        e.log()
        $error = e
        $fatal = true
    }

 /*    //If status is NULL, reset subscription and change status to WORKING
    $:if(!$subscriptionStatus){
        //$subscription = subscriptionReset($currentSeason)

        // Write day URL in subscription
        //$subscription.publicInfo.seasons[$currentSeason.name].day = dayUrl

        //$subscriptionStatus = "working"
    }    */ 

    //If status is DONE, redirect to mon-compte
    $:if ($subscriptionStatus === 'done') $goto('/prive/mon-compte')
    
</script>

<article>

    {#if $subscriptionStatus === 'readyToCheck'}
        <CheckSubscription />
    {:else if $subscriptionStatus === 'uploadedToFirestore'}
        <Success />  
    {:else}
        <SubscribeForm />
    {/if}
    

</article>


<slot></slot> <!-- just to hide error warning in console -->

