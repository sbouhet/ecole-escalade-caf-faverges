<script>
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
    import EmailForm from "../components/EmailForm.svelte"
    import PasswordForm from "../components/PasswordForm.svelte"
    import ErrorMessage from "../components/ErrorMessage.svelte"

    const auth = getAuth();
    let email
    let password = ''
    let password2 = ''
    let error = null
    let userCreated = false
    
    const handleClick = async (e) => {
        e.preventDefault()
        console.log(`trying to create user : ${email}`)
        if (password != password2) {
            console.error('Passwords are different')
            error = 'Les mots de passes sont différents'
            return
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            console.log(`Made new user`)
            userCreated = true
            console.log(userCredential.user)
            email = ''
            password = ''
            error = null
        } catch (error) {
            console.error(error)
        }
    }  
</script>

<form>
    <h1>Créer un compte</h1>
    <EmailForm bind:email={email}/>
    <PasswordForm bind:password={password}/>
    <PasswordForm bind:password={password2}/>
    <br>
    <button on:click={handleClick}>créer un compte</button>
    <h4 class:hidden={!userCreated}>
        Inscription réussie.
    </h4>
    {#if error}
        <ErrorMessage error={error}/>
    {/if}
</form>