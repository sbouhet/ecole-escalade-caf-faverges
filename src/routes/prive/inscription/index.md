<script>
    export let context //just to hide warning in console
    import SubscribeForm from '../../../components/forms/SubscribeForm.svelte'
    import {params} from '@roxi/routify'
    let adult = null
    let day = $params.creneau
</script>

<article>
    <h1>Inscription</h1>
    <section>
        <button class:outline={adult===true || adult===null} on:click|preventDefault={()=>adult=false}>J'inscris mon enfant</button>
        <button class:outline={!adult} on:click|preventDefault={()=>adult=true}>Je m'inscris</button>
    </section>
    
    {#if adult !== null}
    <SubscribeForm {adult} {day}/>

{/if}

</article>

<slot></slot> <!-- just to hide error warning in console -->

<style>
    .hidden{
        opacity:0.5;
    }
</style>
