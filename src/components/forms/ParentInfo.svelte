<script>
    import {currentUser} from '$utils/stores'
    import NameForm from './NameForm.svelte'
    import { subscription } from '$utils/stores'
    export let nb

    let role, email, tel
    if (nb===1) {
        email = $currentUser.email
        role= 'mother'
    }
    if (nb===2) role='father'
    
    $subscription.parents[nb-1] = {}
    $:$subscription.parents[nb-1].role = role
    $:$subscription.parents[nb-1].email = email
    $:$subscription.parents[nb-1].tel = tel

</script>

 <section>
    <h5>Parent {nb}</h5>
    
    <NameForm required={nb==1} target=parent {nb}/>
     
    <label for="relationship">Affiliation</label>
    <select id="relationship" required bind:value={role}>
        <option value="mother">Mère</option>
        <option value="father">Père</option>
        <option value="other">Autre</option>
    </select>
    
    <label for="email">Adresse email</label>
    <input type="email" id="email" name="email" placeholder="Adresse email" disabled={nb==1} bind:value={email}>
    

    <label for="phoneNumber">Telephone</label>
    <input type="tel" id="tel" name="tel" required={nb==1} bind:value={tel}>
</section>