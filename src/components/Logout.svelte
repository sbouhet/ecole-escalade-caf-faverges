<script>
    import { getAuth, signOut } from "firebase/auth"
    const auth = getAuth()
    const handleClick = (e) =>{
        e.preventDefault()
        try {
            signOut(auth)
        } catch (error) {
            throw error
        }
    }
</script>

<button on:click={handleClick}>Se déconnecter</button>