<script>
    import { currentSeason } from '$utils/stores'
    import LicenceInstructions from '$components/LicenceInstructions.svelte'
    import Boolean from '$components/Boolean.svelte'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getApp } from "firebase/app"
    import ErrorMessage from '$components/ErrorMessage.svelte'
    export let student
    const functions = getFunctions(getApp())
    const checkLicence = httpsCallable(functions, "checkLicence")
    let input, error, success
    let loading = false
    $:id = student.public.id
    $:status = student.public.seasons[$currentSeason.name].licence
    
    const handleClick = async ()=>{
        try {
            loading = true
            error = null
            const response = await checkLicence({licenceNb: input, studentId:id, seasonName:$currentSeason.name})
            if(response.data.statusCode!==200){
                error=response.data.message
            }else{
                success=true
            }
            
            loading = false
        } catch (err) {
            console.error(err)
            error="Une erreur est survenue."
            loading= false
        }
     
    }
</script>

<details>
    <summary>
        <Boolean value={status} big={true}/>Étape 3 : Prendre une licence au CAF de Faverges
    </summary>
    {#if status==="no"}

        <LicenceInstructions />
        <div>
            <input type="text" bind:value={input}>
            {#if loading}
                <a href="#" role="button" aria-busy="true">Merci de patienter...</a>
            {:else}
                <a href="#" on:click={handleClick} role="button">Verifier la licence</a>
            {/if}
            <br><br>
            {#if success}
                YOUPPI
            {/if}
            {#if error}
                <ErrorMessage {error} />
            {/if}
        </div>
    {:else if status === "waiting"}
        <ErrorMessage error="Une erreur est survenue, contactez notre équipe : caf.faverges.ffcam@gmail.com" />
    {:else if status === "yes"}
        <div style="color:green">Votre licence est à jour !</div>
    {/if}
</details>

<style>
    summary{
        font-weight: bold;
    }
</style>