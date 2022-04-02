<script>
    import AdultSubscriptionForm from "./AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./ChildSubscriptionForm.svelte"

    export let adult
    export let day

    const handleSubmit = () => {
        console.log("ok")
    }
</script>

{#if day}
    {day}
{/if}

<form on:submit={handleSubmit}>
    {#if adult}
    <AdultSubscriptionForm />
    {:else}
    <ChildSubscriptionForm />
    {/if}
    <button>Submit</button>
</form>
