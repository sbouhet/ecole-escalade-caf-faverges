<script>
    import NameForm from './NameForm.svelte'
    import DateOfBirthForm from './DateOfBirthForm.svelte'
</script>

<section>
    <h5>Enfant</h5>
    
    <NameForm required={true} target=student/>
    <DateOfBirthForm />
    
</section>

