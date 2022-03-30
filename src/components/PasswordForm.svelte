<script>
    export let password = ''
    let focus = false

    const handleFocus = ()=>{
        if (focus) return
        //if first time focused
        password = ''
        focus = true
    }
</script>

<label for="password">Mot de passe</label>
    <input type="password" id="password" bind:value={password} required on:focus={handleFocus} class:default={!focus}/>


<style>
    .default{
        color:lightgrey
    }
    input{
        color:black
    }
</style>