<script>
    import AdultSubscriptionForm from "./AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./ChildSubscriptionForm.svelte"
    import DayForm from "./DayForm.svelte"

    export let adult
    export let dayUrl

    const handleSubmit = () => {
        console.log("ok")
    }
</script>


<form on:submit|preventDefault={handleSubmit}>
    <DayForm {dayUrl}/> 
    {#if adult}
        <AdultSubscriptionForm />
    {:else}
        <ChildSubscriptionForm />
    {/if}
    <button>Submit</button>
</form>
