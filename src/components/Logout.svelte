<script>
    import { getAuth, signOut } from "firebase/auth"
    import ErrorMessage from './ErrorMessage.svelte'
    let error = null
    const auth = getAuth()
    const handleClick = () =>{
        try {
            signOut(auth)
            error = null
        } catch (err) {
            error = err
            throw err
        }
    }
</script>


<button class='secondary' on:click|preventDefault={handleClick}>Se déconnecter</button>
{#if error}
    <ErrorMessage error={error}/>
{/if}