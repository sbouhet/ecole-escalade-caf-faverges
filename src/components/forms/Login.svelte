<script>
    import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
    import EmailForm from "./EmailForm.svelte"
    import PasswordForm from "./PasswordForm.svelte"
    import ErrorMessage from "../ErrorMessage.svelte"

    const auth = getAuth();
    let email, password
    let error = null
    
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
    <button on:click|preventDefault={handleClick}>se connecter</button>
    <ErrorMessage error={error}/>
</form>

