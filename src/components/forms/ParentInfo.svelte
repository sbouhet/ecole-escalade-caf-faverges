<script>
    import NameForm from './NameForm.svelte'
    import { subscription } from '$utils/stores'
    import { getAuth } from "firebase/auth"
    export let nb

    let role, email, tel
    if (nb===1) {
        email = getAuth().currentUser.email
        role= 'mother'
    }
    if (nb===2) role='father'
    
    $subscription.privateInfo.parents[nb-1] = {}
    $:$subscription.privateInfo.parents[nb-1].role = role
    $:$subscription.privateInfo.parents[nb-1].email = email
    $:$subscription.privateInfo.parents[nb-1].tel = tel

</script>

 <section>
    <h5>Parent {nb}</h5>
    
    <NameForm target=parent {nb}/>
     
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