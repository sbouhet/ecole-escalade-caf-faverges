<script>
    export let context //just to hide warning in console
    import SubscribeForm from '$components/forms/SubscribeForm.svelte'
    import CheckSubscription from '$components/CheckSubscription.svelte'
    import {params} from '@roxi/routify'
    import { currentSeason, currentDay, subscription } from '$utils/stores'
    import { getDayFromUrl } from '$utils/days'
    import Success from '$components/Success.svelte'
    import { goto } from '@roxi/routify'
    import Back from '$components/Back.svelte'
    import { getSeasonFromFirestore } from '$utils/firestore'
    import { seasons } from '$utils/seasons'

    let dayUrl = $params.creneau
    if (dayUrl) {
        $currentDay = getDayFromUrl(dayUrl, $currentSeason.days)
    }

/*     const updateSeasonObject = async ()=>{
        //$currentSeason = null
        try {
            let firestoreSeason = await getSeasonFromFirestore("current")
            $currentSeason = firestoreSeason
        } catch (error) {
            throw error
        }
    } */

    $:if ($subscription.seasons[seasons().current].status === 'done') {
        $goto('/')  
        /* updateSeasonObject().then(()=>{
            $goto('/')  
        }) */
    }

</script>

<article>
    <h1>Inscription</h1>
    {#if $subscription.seasons[seasons().current].status === 'readyToCheck'}
        <CheckSubscription />
    {:else if $subscription.seasons[seasons().current].status === 'uploadedToFirestore'}
        <Success />
    {/if}

    {#if $subscription.seasons[seasons().current].status !== 'done'}
        <SubscribeForm />
    {/if}
    
</article>

<Back home={true}/>

<slot></slot> <!-- just to hide error warning in console -->
