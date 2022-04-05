<script>
    export let target, nb
    import { subscription } from '$utils/stores'
    let firstName, lastName

    $:if (target==='student') {
        if (firstName) $subscription.publicInfo.firstName = firstName.toLowerCase()
        if (lastName) $subscription.publicInfo.lastName = lastName.toLowerCase()
    }else if(target==='parent'){
        if (firstName) $subscription.privateInfo.parents[nb-1].firstName = firstName.toLowerCase()
        if (lastName) $subscription.privateInfo.parents[nb-1].lastName = lastName.toLowerCase()
    }
</script>

<div class="grid">
    <div>
        <label for="firstname">Prénom</label>
        <input type="text" id="firstname" name="firstname" placeholder="Prénom" required bind:value={firstName}>
    </div>
    
    <div>
        <label for="lastname">Nom de famille</label>
        <input type="text" id="lastname" name="lastname" placeholder="Nom de famille" required bind:value={lastName}>
    </div>
</div>
