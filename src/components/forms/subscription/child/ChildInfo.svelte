<script>
    import NameForm from './NameForm.svelte'
    import DateOfBirthForm from './DateOfBirthForm.svelte'
    import {subscription} from '$utils/stores'

    let firstName, lastName, dateOfBirth

    // Persistent data, in case user leaves the page and comes back
    // If the forms are empty, fill inputs with $subscription data
    if (!firstName)firstName = $subscription.publicInfo.firstName
    if (!lastName)lastName = $subscription.publicInfo.lastName
    if (!dateOfBirth) dateOfBirth = $subscription.privateInfo.dateOfBirth

    // Sync $subscription store when data in written in form
    $:if (firstName) $subscription.publicInfo.firstName = firstName.toLowerCase()
    $:if (lastName) $subscription.publicInfo.lastName = lastName.toLowerCase()
    $:if (dateOfBirth) $subscription.privateInfo.dateOfBirth = dateOfBirth

</script>

<section>
    <h5>Enfant</h5>
    
    <NameForm bind:firstName bind:lastName  />
    <DateOfBirthForm bind:dateOfBirth/>
    
</section>

