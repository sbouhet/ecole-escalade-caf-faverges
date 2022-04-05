<script>
    import { subscription, currentDay, currentSeason } from '$utils/stores'
    import { getDayName } from '$utils/days'
    import { printName } from '$utils/printName'
    import { seasons } from '$utils/seasons'
    let open = true

    const subscribeAnother = ()=>{
        $subscription.seasons[seasons().current].status = null
    }

    const backToHomePage = ()=>{
        $subscription.seasons[seasons().current].status = 'done'
    }
</script>

<dialog open={open}>
  <article>
    <h2>Votre demande d'inscription a bien été enregistrée !</h2>
    <p><b>{printName($subscription)}</b> est bien inscrit(e) sur le créneau du {getDayName($currentDay)}</p>
      
    
      
    <footer>
      <a href="#" role="button" class="outline" on:click={subscribeAnother}>Inscire quelqu'un d'autre</a>
      <a href="#" role="button" on:click={backToHomePage}>Revenir à l'accueil</a>
    </footer>
  </article>
</dialog>
