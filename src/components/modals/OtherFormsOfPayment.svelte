
<script>
    import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { getApp } from "firebase/app"
    import { currentSeason } from "$utils/stores"
    const functions = getFunctions(getApp())
    //connectFunctionsEmulator(functions, "localhost", 5001)
    const changePaymentStatusToWaiting = httpsCallable(functions, "changePaymentStatusToWaiting")
    const setPaymentType = httpsCallable(functions, "setPaymentType")

    export let open, id, error
    let paymentType = "check"
    let agree= false
    let loading = false
    
    let handleClick = async ()=>{
        error = false
        loading = true
        console.log("starting")
        const result2 = await setPaymentType({seasonName: $currentSeason.name,studentId: id, paymentType})
        console.log(result2)
        const result = await changePaymentStatusToWaiting({seasonName: $currentSeason.name,studentId: id})
        console.log(result)
        loading = false
        if (result.data.statusCode === 200 && result2.data.statusCode) {
            open = false
        }else{
            error = true
        }
    }

</script>

<dialog open={open}>
  <article>
      <h4>Autres moyens de paiement</h4>

          <fieldset>
            <legend>Séléctionnez votre moyen de paiement :</legend>
            <br>
            <label for="check">
              <input type="radio" id="check" bind:group={paymentType} name="paymentType" value={"check"} disabled={loading}>
              Chèque(s)<br>
              <small>Paiement en trois fois disponible</small>
            </label>
            <label for="cash">
              <input type="radio" id="cash" bind:group={paymentType} name="paymentType" value={"cash"} disabled={loading}>
              Espèces
            </label>
            <label for="hollidayCheck">
              <input type="radio" id="hollidayCheck" bind:group={paymentType} name="paymentType" value={"hollidayCheck"} disabled={loading}>
              Chèque vacances
            </label>
          </fieldset>

          <label for="agree">
            <input type="checkbox" id="agree" name="agree" bind:checked={agree} disabled={loading}>
            Je m'engage à transmettre mon moyen de paiement au CAF de Faverges avant le <b>{dayjs($currentSeason.deadline).format("dddd D MMMM à HH:mm")}</b>.
          </label>
          {#if error}
          <br>
          <p style="color:red"><b>Une erreur est survenue</b></p>
      {/if}
    <footer>
       
        {#if loading}
            <a href="#" role="button" class="secondary outline" disabled>Annuler</a>
            <a href="#" role="button" aria-busy={true} disabled>Merci de patienter...</a>
        {:else}    
            <a href="#" role="button" class="secondary outline" on:click={()=>open=false}>Annuler</a>
            {#if agree}  
                <a href="#" role="button" on:click={handleClick}>Valider</a>
            {:else}
                <a href="#" role="button" on:click={handleClick} disabled>Valider</a>
            {/if}
        {/if}
        
        
       
    </footer>
  </article>
</dialog>

<style>
    li{
        list-style: none;
    }
</style>