<script>
    import { getAuth, signOut } from "firebase/auth"
    import ErrorMessage from './ErrorMessage.svelte'
    export let tiny = false
    let error = null
    const auth = getAuth()
    const handleClick = () =>{
        try {
            signOut(auth)
            error = null
        } catch (err) {
            error = err
            throw new BError("Logout not working", err)
        }
    }
</script>


{#if tiny}
    <a href="#" on:click|preventDefault={handleClick}>Se déconnecter</a>
{:else}
    <button class='secondary outline' on:click|preventDefault={handleClick}>Se déconnecter</button>
{/if}


{#if error}
    <ErrorMessage error={error}/>
{/if}

<style>
    
</style>