<script>
    import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
    import ErrorMessage from "../htmlElements/ErrorMessage.svelte"
    import { BError } from "berror"

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
            throw new BError("Could not signin", err)
        });
    }  
</script>

<div>
    <form>
        <h1>Se connecter</h1>
        <label for="email">Adresse email</label>
        <input type="email" id="email" name="email" placeholder="Adresse email"  bind:value={email} required>
    
        <label for="password">Mot de passe</label>
        <input type="password" id="password" bind:value={password} required />
        
        <br>
        <button on:click|preventDefault={handleClick}>Se connecter</button>
        <ErrorMessage error={error}/>
        <small>Pas encore de compte ? <a href="#" on:click={handleSwitch}>Créer un compte</a></small>
    </form>
</div>

<style>
    form{
        width:80%;
        max-width: 500px;
    }
    div{
        display: flex;
        justify-content: center;
    }
</style>