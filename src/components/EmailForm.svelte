<script>
    export let email = 'votre adresse email'
    let focus = false

    const handleFocus = ()=>{
        if (focus) return
        //if first time focused
        email = ''
        focus = true
    }
</script>

<label for="email">Adresse email</label>
<input type="email" bind:value={email} required id="email" on:focus={handleFocus} class:default={!focus}/>


<style>
    .default{
        color:lightgrey
    }
    input{
        color:black;
        width: 100%;
        max-width: 400px;
    }
    
</style>