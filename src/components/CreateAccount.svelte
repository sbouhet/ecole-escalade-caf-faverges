<script>
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
    import EmailForm from "./forms/EmailForm.svelte"
    import PasswordForm from "./forms/PasswordForm.svelte"
    import ErrorMessage from "./ErrorMessage.svelte"

    const auth = getAuth();
    let email
    let password = ''
    //let password2 = ''
    let error = null
    export let showCreateAccount

    const handelSwitch = ()=>{
        showCreateAccount = false
    }
    
    const handleClick = async () => {
        console.log(`trying to create user : ${email}`)
        /* if (password != password2) {
            console.error('Passwords are different')
            error = 'Erreur : Les mots de passes sont différents'
            return
        } */
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            console.log(`Made new user`)
            console.log(userCredential.user)
            email = ''
            password = ''
            error = null
        } catch (err) {
            console.error(err)
            error = err
        }
    }  
</script>

<form>
    <h1>Créer un compte</h1>
    <EmailForm bind:email={email}/>
    <PasswordForm bind:password={password}/>
    <!-- <PasswordForm bind:password={password2}/> -->
    <br>
    <button on:click|preventDefault={handleClick}>Créer un compte</button>
    
    {#if error}
        <ErrorMessage error={error}/>
    {/if}
    <small>Vous avez déjà un compte ? <a href="#" on:click={handelSwitch}>Connectez-vous</a></small>
</form>