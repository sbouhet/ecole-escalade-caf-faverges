<script>
    export let context //just to hide warning in console
    import SubscribeForm from '$components/forms/SubscribeForm.svelte'
    import CheckSubscription from '$components/CheckSubscription.svelte'
    import {params} from '@roxi/routify'
    import { currentSeason, currentDay, subscription } from '$utils/stores'
    import { getDayFromUrl } from '$utils/days'
    import Success from '$components/Success.svelte'
    import { goto } from '@roxi/routify'
    import { subscriptionReset } from '$utils/subscriptionReset'

    let dayUrl = $params.creneau
    let status
    if (dayUrl) {
        $currentDay = getDayFromUrl(dayUrl, $currentSeason.days)
    }
    $subscription = subscriptionReset($currentSeason)
    $:status = $subscription.publicInfo.seasons[$currentSeason.name].status
</script>

<article>
    <hgroup>
        <h1>Inscription</h1>
        <h1>Saison {$currentSeason.name}</h1>
    </hgroup>
    {#if status === 'readyToCheck'}
        <CheckSubscription />
    {:else if status === 'uploadedToFirestore'}
        <Success />
    {/if}

    <SubscribeForm />

</article>


<slot></slot> <!-- just to hide error warning in console -->
