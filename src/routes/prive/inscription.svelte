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
    import { subscriptionReset } from '$utils/subscriptionReset'

    let dayUrl = $params.creneau
    if (dayUrl) {
        $currentDay = getDayFromUrl(dayUrl, $currentSeason.days)
    }
    $subscription = subscriptionReset($currentSeason)


    $:if ($subscription.publicInfo.seasons[$currentSeason.name].status === 'done') {
        $goto('/')  
    }

</script>

<article>
    <hgroup>
        <h1>Inscription</h1>
        <h1>Saison {$currentSeason.name}</h1>
    </hgroup>
    {#if $subscription.publicInfo.seasons[$currentSeason.name].status === 'readyToCheck'}
        <CheckSubscription />
    {:else if $subscription.publicInfo.seasons[$currentSeason.name].status === 'uploadedToFirestore'}
        <Success />
    {/if}

    {#if $subscription.publicInfo.seasons[$currentSeason.name].status !== 'done'}
        <SubscribeForm />
    {/if}

</article>


<slot></slot> <!-- just to hide error warning in console -->
