<script>
    import { sendEmailVerification } from "firebase/auth"
    import {currentUser} from '../utilities/stores'
    
    const actionCodeSettings = {
    url: 'https://ee22.netlify.app/',
    handleCodeInApp: true
    }
    const handleClick = async () => {
        console.log(`Trying to send email to ${$currentUser.email}`)
        console.log($currentUser)
        await sendEmailVerification($currentUser, actionCodeSettings);
// Obtain code from the user.
//await applyActionCode(auth, code);
    }

</script>


Vous êtes connectés mais votre adresse mail n'est pas vérifiée.<br>
<br>
Cliquez ici pour la verifier

<button on:click|preventDefault={handleClick}>Envoyer le mail de verification</button>