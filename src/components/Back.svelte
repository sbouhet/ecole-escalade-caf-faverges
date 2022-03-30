<script>
    const goBack = () => {
        history.back()
    }
</script>

<button class="secondary" on:click={goBack}>Retour</button>

<style>
    button{
        max-width: 200px;
        margin-top: 20px;
    }
</style>