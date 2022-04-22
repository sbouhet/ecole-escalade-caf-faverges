<script>
    export let error = null

    const translateError = (errorCode) => {
        if (!errorCode) return
        const english = ["auth/missing-email", "auth/invalid-email", "auth/user-not-found", "auth/internal-error", "auth/wrong-password", "auth/too-many-requests", "auth/email-already-in-use", "permission-denied", "auth/weak-password"]
        const french = ["Pas d'adresse email", "Adresse email non valide", "Utilisateur non trouvé", "Pas de mot de passe", "Mauvais mot de passe", "Trop d'essais, attendez un petit peu ou réinitialisez votre mot de passe", "Adresse email déjà utilisée", "Vous n'avez pas les autorisations", "Mot de passe trop court (6 caractères minimum)"]
        const index = english.indexOf(errorCode) //find position of error in array
        if (index==-1) return errorCode //if not found in array, return errorCode as is, in english
        return `${french[index]}` //return french translation
    }

    $:if(error && error.errorInfo) error = error.errorInfo
</script>

{#if error}
    {#if error.code}
	    <p>Erreur : {translateError(error.code)}</p>
    {:else}
        <p>Erreur : {error}</p>
    {/if}
{/if}


<style>
    p{
        color: red
    }
</style>