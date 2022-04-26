<script>
    import { goto } from '@roxi/routify'
    export let path
    export let msg = 'Retour'
    
    const handleClick = () => {
        //console.clear()
        if(!path) history.back()
        $goto(path)
    }
</script>

<button class="contrast" on:click={handleClick}>
    {msg}  
</button>

<style>
    /* button{
        max-width: 200px;
        margin-top: 20px;
    } */
</style>