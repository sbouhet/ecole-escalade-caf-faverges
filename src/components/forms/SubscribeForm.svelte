<script>
    import AdultSubscriptionForm from "./AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./ChildSubscriptionForm.svelte"

    export let adult
    export let day
</script>

{#if day}
    {day}
{/if}


{#if adult}
<AdultSubscriptionForm />
{:else}
<ChildSubscriptionForm />
{/if}