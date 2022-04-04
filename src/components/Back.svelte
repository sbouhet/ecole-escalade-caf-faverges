<script>
    import { goto } from '@roxi/routify'
    export let home

    const goBack = () => {
        if(home){
            $goto('/')
        }else{
            history.back()
        }
    }
</script>

<button class="secondary" on:click={goBack}>
    {#if home}
        Accueil
    {:else}
        Retour
    {/if}
    
</button>

<style>
    button{
        max-width: 200px;
        margin-top: 20px;
    }
</style>