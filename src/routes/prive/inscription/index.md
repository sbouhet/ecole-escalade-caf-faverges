<script>
    export let context //just to hide warning in console
    import SubscribeForm from '$components/forms/SubscribeForm.svelte'
    import {params} from '@roxi/routify'
    import { currentSeason, currentDay } from '$utils/stores'
    import { getDayFromUrl } from '$utils/days'

    let dayUrl = $params.creneau

    if (dayUrl) {
        $currentDay = getDayFromUrl(dayUrl, $currentSeason.days)
    }
</script>

<article>
    <h1>Inscription</h1>
    
    
   
     <SubscribeForm />
    
</article>

<slot></slot> <!-- just to hide error warning in console -->
