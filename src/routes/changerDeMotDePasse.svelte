<script>
    import { getAuth, sendPasswordResetEmail } from "firebase/auth"
    import {params} from '@roxi/routify'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    let email = $params.email
    let error = null
    let loading, success
    let emailSent

    const handleClick = ()=>{
        if (loading) return
        loading = true
        success = false
        error = null
        sendPasswordResetEmail(getAuth(), email)
        .then(() => {
            emailSent = email
            console.log('succes')
            success = true
            loading = false
        })
        .catch((e) => {
            loading = false
            success = false
            error = e
        });
    }
</script>

<div>
    <form>
        <h1>Réinitialiser votre mot de passe</h1>
        <label for="email">Adresse email</label>
        <input type="email" id="email" name="email" placeholder="Adresse email"  bind:value={email} required>
        <br>
        <button on:click|preventDefault={handleClick} disabled={loading} aria-busy={loading}>Envoyer l'email de réinitialisation</button>
        <ErrorMessage error={error}/>
        {#if success}
            <div style="color:green">
                Un email a été envoyé à l'adresse {emailSent} pour réinitialiser votre mot de passe. Veuillez consulter votre messagerie.
            </div>
        {/if}
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