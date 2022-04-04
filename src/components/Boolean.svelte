<script>
    export let value
</script>

{#if value}
    <div class="true">OK</div>
{:else}
    <div class="false">Non</div>
{/if}

<style>
    .true{
        color: green;
    }

    .false{
        color: red;
    }
</style>