<script>
    export let email = 'Votre adresse email'
    let focus = false

    const handleFocus = ()=>{
        if (focus) return
        //if first time focused
        email = undefined
        focus = true
    }
</script>

<label for="email">Adresse email</label>
<input type="email" bind:value={email} required id="email" on:focus={handleFocus} class:default={!focus}/>


<style>
    .default{
        color:lightgrey
    }
    
</style>