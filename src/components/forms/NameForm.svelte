<script>
    export let required = false
    export let target, nb
    import { subscription } from '$utils/stores'

    $:if (target==='student' && firstName && lastName) {
        $subscription.firstName = firstName.toLowerCase()
        $subscription.lastName = lastName.toLowerCase()
    }else if(target==='parent' && firstName && lastName){
        $subscription.parents[nb-1].firstName = firstName.toLowerCase()
        $subscription.parents[nb-1].lastName = lastName.toLowerCase()
    }
    let firstName, lastName
</script>

<div class="grid">
    <div>
        <label for="firstname">Prénom</label>
        <input type="text" id="firstname" name="firstname" placeholder="Prénom" {required} bind:value={firstName}>
    </div>
    
    <div>
        <label for="lastname">Nom de famille</label>
        <input type="text" id="lastname" name="lastname" placeholder="Nom de famille" {required} bind:value={lastName}>
    </div>
</div>
