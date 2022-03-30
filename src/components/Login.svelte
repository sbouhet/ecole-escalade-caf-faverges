<script>
    import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
    const auth = getAuth();
    let email
    let password = ''
    let error = null
    
    const handleClick = (e) => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential.user)
            email = ''
            password = ''
            error = null
        })
        .catch((err) => {
            throw err
        });
    }  
</script>

<form>
    <h1>Se connecter</h1>
    email
    <input type="email" bind:value={email}>
    password
    <input type="password" bind:value={password}>
    <br>
    <button on:click|preventDefault={handleClick}>se connecter</button>
</form>

<style>

</style>