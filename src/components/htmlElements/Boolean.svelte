<script>
    export let value
    export let big=false
    import {STATES, ICONS_BIG, ICONS_SMALL, COLORS} from '$utils/STEPS'
    let tooltip
    if(value==="waiting") tooltip = "En cours de validation"
</script>

{#each STATES as state, index}
    {#if value === state}  
        {#if big}
            <span class="big" data-tooltip={tooltip}>{ICONS_BIG[index]}</span>
        {:else}
            <span class="small" style="color:{COLORS[index]}" data-tooltip={tooltip}>{ICONS_SMALL[index]}</span>
        {/if}
    {/if}
{/each}



<style>
    .small{
        font-size:x-large;
    }
    .big{
        margin-right: 20px;
        font-size:medium;
        color:white;
    }
</style>