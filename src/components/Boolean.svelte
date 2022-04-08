<script>
    export let value
    export let big=false
</script>


{#if value}
    {#if big}
        <span class="true big">✅</span>
    {:else}
        <span class="true">☑</span>
    {/if}
{:else}
    {#if big}
        <span class="false big">❌</span>
    {:else}
        <span class="false">×</span>
    {/if}
{/if}

<style>
    .true{
        color: green;
    }

    .false{
        color: red;
    }
    span{
        font-size:x-large;
    }
    .big{
        margin-right: 20px;
        font-size:medium;
    }
</style>