<script>
    import {goto} from '@roxi/routify'
    export let open = true
    export let dayUrl
</script>

<dialog {open}>
    <article>

        <h3>Êtiez-vous inscrit(e) la saison dernière ?</h3>

        <div class="container">
            <button on:click={$goto("/prive/inscription/[dayUrl]", {dayUrl})}>Oui</button>
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