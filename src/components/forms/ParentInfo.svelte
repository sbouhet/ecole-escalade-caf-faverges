<script>
    import {currentUser} from '../../utilities/stores'
    import NameForm from './NameForm.svelte'
    const user = $currentUser
    export let nb

</script>

 <section>
    <h5>Parent {nb}</h5>
    
    <NameForm required={nb==1} />
     
    <label for="relationship">Affiliation</label>
    <select id="relationship" required>
        {#if nb==1}
            <option value="mother" selected>Mère</option>
        <option value="father">Père</option>
        {:else}
            <option value="mother">Mère</option>
        <option value="father" selected>Père</option>
        {/if}
        
        <option value="other">Autre</option>
    </select>
    
    <label for="email">Adresse email</label>
    {#if nb==1}
        <input type="email" id="email" name="email" value={user.email} disabled>
    {:else}
        <input type="email" id="email" name="email" placeholder="Adresse email" required>
    {/if}

    <label for="phoneNumber">Telephone</label>
    <input type="tel" id="tel" name="tel">
</section>