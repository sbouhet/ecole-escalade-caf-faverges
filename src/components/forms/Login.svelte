<script>
    import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
    import EmailForm from "./EmailForm.svelte"
    import PasswordForm from "./PasswordForm.svelte"
    import ErrorMessage from "../ErrorMessage.svelte"

    const auth = getAuth();
    let email, password
    let error = null
    export let showCreateAccount

    const handleSwitch = () =>{
        showCreateAccount = true
    }
    
    const handleClick = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            email = undefined
            password = undefined
            error = null
        })
        .catch((err) => {
            error = err
            throw err
        });
    }  
</script>

<form>
    <h1>Se connecter</h1>
    <EmailForm bind:email={email}/>
    <PasswordForm bind:password={password}/>
    
    <br>
    <button on:click|preventDefault={handleClick}>Se connecter</button>
    <ErrorMessage error={error}/>
    <small>Pas encore de compte ? <a href="#" on:click={handleSwitch}>Créer un compte</a></small>
</form>

