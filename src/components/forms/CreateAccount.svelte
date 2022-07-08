<script>
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
    import ErrorMessage from "../htmlElements/ErrorMessage.svelte"
    import WhyCreateAccount from "$components/modals/WhyCreateAccount.svelte"

    const auth = getAuth();
    let email
    let password = ''
    //let password2 = ''
    let error = null
    let openModal = false
    export let showCreateAccount

    const handelSwitch = ()=>{
        showCreateAccount = false
    }
    
    const handleClick = async () => {
        console.log(`trying to create user : ${email}`)

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

<WhyCreateAccount bind:open={openModal}/>

<form>
    <h1>Créer un compte</h1>
    
    ℹ<a href="" on:click={()=>openModal=true}>À quoi ca sert ?</a>
    <br><br>
    <label for="email">Adresse email</label>
    <input type="email" id="email" name="email" placeholder="Adresse email" bind:value={email} required>
    
    <label for="password">Mot de passe</label>
    <input type="password" id="password" bind:value={password} required/>

   
    <br>
    <button on:click|preventDefault={handleClick}>Créer un compte</button>
    
    {#if error}
        <ErrorMessage error={error}/>
    {/if}
    <small>Vous avez déjà un compte ? <a href="#" on:click={handelSwitch}>Connectez-vous</a></small>
</form>