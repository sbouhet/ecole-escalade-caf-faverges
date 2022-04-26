<script>
    import { currentSeason } from '$utils/stores'
    import LicenceInstructions from '$components/subscriptionSteps/LicenceInstructions.svelte'
    import Boolean from '$components/Boolean.svelte'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getApp } from "firebase/app"
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import HowToFindLicence from '$components/HowToFindLicence.svelte'
    export let student
    const functions = getFunctions(getApp())
    const checkLicence = httpsCallable(functions, "checkLicence")
    let error, input, modalOpen
    let loading = false
    $:id = student.public.id
    $:status = student.public.seasons[$currentSeason.name].licence
    
    const handleClick = async ()=>{
        try {
            loading = true
            error = null
            const response = await checkLicence({licenceNb: input, studentId:id, seasonName:$currentSeason.name})
            console.log(response)
            if(response.data.statusCode!==200){
                error=response.data.message
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
        <HowToFindLicence bind:open={modalOpen}/>
        <div>
            <p>
                Vous avez pris une licence ? Indiquez votre numéro de licence ci-dessous puis
                cliquez sur le boutton pour valider cette étape.
            </p>
            <a href="#" on:click={()=>modalOpen=true}><small>Comment trouver mon numéro de licence ?</small></a>
            <div class="grid">
                <input type="text" bind:value={input} placeholder="Votre numéro de licence">
                <div>
                    {#if loading}
                        <a href="#" role="button" aria-busy="true">Merci de patienter...</a>
                    {:else}
                        <a href="#" on:click={handleClick} role="button">Verifier la licence</a>
                    {/if}
                </div>
            </div>
            <br>
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