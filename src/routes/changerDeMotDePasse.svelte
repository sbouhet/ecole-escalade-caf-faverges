<script>
    import { getAuth, sendPasswordResetEmail } from "firebase/auth"
    import {params} from '@roxi/routify'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    let email = $params.email
    let error = null

    const handleClick = ()=>{
        sendPasswordResetEmail(getAuth(), email)
        .then(() => {
            console.log('succes');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
    }
</script>

<div>
    <form>
        <h1>Réinitialiser votre mot de passe</h1>
        <label for="email">Adresse email</label>
        <input type="email" id="email" name="email" placeholder="Adresse email"  bind:value={email} required>
        <br>
        <button on:click|preventDefault={handleClick}>Envoyer l'email de réinitialisation</button>
        <ErrorMessage error={error}/>
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