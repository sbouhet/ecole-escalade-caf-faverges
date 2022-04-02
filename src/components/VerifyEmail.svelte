<script>
    import { sendEmailVerification } from "firebase/auth"
    import {currentUser} from '../utilities/stores'
    import ErrorMessage from './ErrorMessage.svelte'

    let error = null
    let emailSent = null
    
    const actionCodeSettings = {
    url: 'https://ee22.netlify.app/',
    handleCodeInApp: true
    }
    const handleClick = async () => {
        console.log(`Trying to send email to ${$currentUser.email}`)
        sendEmailVerification($currentUser, actionCodeSettings).then(()=>{
            console.log('Email sent')
            emailSent = true
        }).catch(err=>{
            error = err
            emailSent = null
        })
        
// Obtain code from the user.
//await applyActionCode(auth, code);
    }

</script>
<h1>Vérification de votre adresse e‑mail</h1>
<p>Cliquez sur le bouton ci-dessous pour valider votre adresse e‑mail.
    Un e‑mail sera envoyé à l'adresse <b>{$currentUser.email}</b>, ouvrez-le puis cliquez sur le lien.</p>
<br>

{#if emailSent}
    <p><b>L'e‑mail de vérification a bien été envoyé, consultez votre messagerie.</b></p>
{:else}
    <button on:click|preventDefault={handleClick}>Envoyer l'e‑mail de verification</button>

{/if}
{#if error}
    <ErrorMessage error={error}/>
{/if}
