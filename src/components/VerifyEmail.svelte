<script>
    import { sendEmailVerification } from "firebase/auth"
    import {currentUser} from '../utilities/stores'
    import ErrorMessage from './ErrorMessage.svelte'

    let error = null
    
    const actionCodeSettings = {
    url: 'https://ee22.netlify.app/',
    handleCodeInApp: true
    }
    const handleClick = async () => {
        console.log(`Trying to send email to ${$currentUser.email}`)
        console.log($currentUser)
        sendEmailVerification($currentUser, actionCodeSettings).then(
            console.log('Email sent')
        ).catch(err=>{
            error = err
        })
        
// Obtain code from the user.
//await applyActionCode(auth, code);
    }

</script>


Vous êtes connectés mais votre adresse mail n'est pas vérifiée.<br>
<br>
Cliquez ici pour la verifier

<button on:click|preventDefault={handleClick}>Envoyer le mail de verification</button>
{#if error}
    <ErrorMessage error={error}/>
{/if}
