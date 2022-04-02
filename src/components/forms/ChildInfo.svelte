<script>
    import NameForm from './NameForm.svelte'
</script>

<section>
    <h5>Enfant</h5>
    
    <NameForm required={true}/>
    
    <div>
        <label for="dateOfBirth">Date de naissance</label>
        <input type="date" required>
    </div>
</section>