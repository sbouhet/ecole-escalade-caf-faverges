<script>
    /* -------------------------------------------------------------------
    This page tries to find a day object based on url and $currentSeason
    Stores it in $currentDay
    Then it displays differents components based on the value of $subscriptionStatus
   
    status is READY TO CHECK    >    show <CheckSubscription>
    status is UPLOADED TO FIRESTORE    >    show <Success>
    -------------------------------------------------------------------  */
    export let context //just to hide warning in console
    import SubscribeForm from '$components/forms/subscription/SubscribeForm.svelte'
    import CheckSubscription from '$components/modals/CheckSubscription.svelte'
    import ImageRights from '$components/modals/ImageRights.svelte'
    import ParentalAuthorization from '$components/modals/ParentalAuthorization.svelte'
    import {params} from '@roxi/routify'
    import { currentSeason, subscription, subscriptionStatus, error, fatal, currentDay } from '$utils/stores'
    import { getDayFromUrl, isDayForAdults } from '$utils/days'
    import Success from '$components/modals/Success.svelte'
    import { BError } from 'berror'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    

    //get day from url
    let dayUrl = $params.dayUrl
    
    let adult

    //Try to find corresponding day in current season
    try {
        $currentDay = getDayFromUrl(dayUrl, $currentSeason.days)

        //Check if day is for adults
        adult = isDayForAdults($currentDay, $currentSeason.ageGroups)

        // Write day URL in subscription
        $subscription.publicInfo.seasons[$currentSeason.name].day = dayUrl

    } catch (err) {
        const e = new BError(`Could not find day with url ${dayUrl}`, err, {days:$currentSeason.days})
        e.log()
        $error = e
        $fatal = true
    }

</script>

<div>
    <article>
            {#if $subscriptionStatus === 'imageRights'}
                <ImageRights {adult}/>
            {:else if $subscriptionStatus === 'parentalAuthorization'}
                <ParentalAuthorization />  
            {:else if $subscriptionStatus === 'readyToCheck'}
                <CheckSubscription {adult}/>
            {:else if $subscriptionStatus === 'uploadedToFirestore'}
                <Success />  
            {:else} 
                <SubscribeForm {adult}/>
            {/if}
    </article>
</div>

<slot></slot> <!-- just to hide error warning in console -->

<style>
    article{
      max-width: 800px; 
      margin-top: 0;
    }
    div{
       
        display: flex;
        justify-content: center;
        
    }
</style>