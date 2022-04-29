<script>
    import NameForm from '../NameForm.svelte'
    import { subscription } from '$utils/stores'
    import { getAuth } from "firebase/auth"

    let firstName, lastName, tel, accidentTel
    export let ageConfirmed

    $:email = getAuth().currentUser.email
    
    // Persistent data, in case user leaves the page and comes back
    // If the forms are empty, fill inputs with $subscription data
    if(!firstName) firstName = $subscription.publicInfo.firstName
    if(!lastName) lastName = $subscription.publicInfo.lastName
    if(!tel) tel = $subscription.privateInfo.tel
    if(!accidentTel) accidentTel = $subscription.privateInfo.accidentTel
    
    // Sync $subscription store when data in written in form
    $:if(firstName) $subscription.publicInfo.firstName = firstName
    $:if(lastName) $subscription.publicInfo.lastName = lastName
    $:if(tel) $subscription.privateInfo.tel = tel
    $:if(email) $subscription.privateInfo.email = email
    $:if(accidentTel) $subscription.privateInfo.accidentTel = accidentTel

</script>

 <section>
    <NameForm bind:firstName bind:lastName/>
    
    <label for="email">Adresse email</label>
    <input type="email" id="email" name="email" placeholder="Adresse email" disabled bind:value={email}>
    

    <label for="phoneNumber">Téléphone</label>
    <input type="tel" id="tel" name="tel" required bind:value={tel}>

    <label for="phoneNumber">Téléphone de la personne à prévenir en cas d'accident</label>
    <input type="tel" id="tel" name="tel" required bind:value={accidentTel}>

    <fieldset>
    <label for="switch">Je suis majeur</label>
    <input type="checkbox" id="switch" name="switch" role="switch" bind:checked={ageConfirmed}>
    </fieldset>
</section>