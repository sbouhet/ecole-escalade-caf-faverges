<script>
    export let value
</script>

{#if value}
    <div class="true">☑</div>
{:else}
    <div class="false">×</div>
{/if}

<style>
    .true{
        color: green;
    }

    .false{
        color: red;
    }
    div{
        font-size:x-large;
    }
</style>