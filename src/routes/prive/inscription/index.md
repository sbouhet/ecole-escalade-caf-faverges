<script>
    export let context //just to hide warning in console
    import SubscribeForm from '../../../components/forms/SubscribeForm.svelte'
    import {params} from '@roxi/routify'
    import { isUrlAdult} from '../../../utilities/isUrlAdult'
    import { currentSeason } from '../../../utilities/stores'

    let dayUrl = $params.creneau
    let adult = null

    if (dayUrl) {
        adult = isUrlAdult(dayUrl, $currentSeason)
    }

</script>

<article>
    <h1>Inscription</h1>
    {#if !dayUrl}
        <section>
            <button class:outline={adult===true || adult===null} on:click|preventDefault={()=>adult=false}>J'inscris mon enfant</button>
            <button class:outline={!adult} on:click|preventDefault={()=>adult=true}>Je m'inscris aux cours adultes</button>
        </section>
    {/if}
    {#if adult !== null}
     <SubscribeForm {adult} {dayUrl}/>
    {/if}
</article>

<slot></slot> <!-- just to hide error warning in console -->

<style>
    .hidden{
        opacity:0.5;
    }
</style>
