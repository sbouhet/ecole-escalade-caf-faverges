<script>
    import {goto} from '@roxi/routify'
    import {currentSeason} from '$utils/stores'
    export let open = true
    export let dayUrl
    const resubscriptionDate = dayjs($currentSeason.resubscriptionDate)
    const timeUntilResubscription = resubscriptionDate.diff(dayjs(), "seconds")
</script>

<dialog {open}>
    <article>

        <h3>Êtiez-vous inscrit(e) la saison dernière ?</h3>

        <div class="container">
            {#if timeUntilResubscription > 0}
                <button on:click={$goto("/countdown", {dayUrl, resubscription:"true"})}>Oui</button>
            {:else}
                <button on:click={$goto("/prive/inscription/[dayUrl]", {dayUrl})}>Oui</button>
            {/if}
            <button on:click={$goto("/countdown", {dayUrl})}>Non</button>
        </div>
    
</article>
</dialog>

<style>
    .container{
        display: flex;
    }
    button{
        margin:10px;
    }
</style>