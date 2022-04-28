<script>
    import { subscription, currentDay, currentSeason, subscriptionStatus } from '$utils/stores'
    import { getDayName } from '$utils/days'
    import { printName } from '$utils/printName'
    import { goto } from '@roxi/routify'
    import { subscriptionReset } from '$utils/subscriptionReset'
    
    let open = true

    const subscribeAnother = ()=>{
        $subscriptionStatus = null
    }

    const done = ()=>{
      $subscription = subscriptionReset($currentSeason)
      $subscriptionStatus = null
      $goto('/prive/mon-compte')
    }
</script>

<dialog open={open}>
  <article>
    <h2>Votre demande d'inscription a bien été enregistrée !</h2>
    <p><b>{printName($subscription.publicInfo)}</b> est pré‑inscrit·e sur le créneau de {getDayName($currentDay)}</p>
    <p>Accédez à votre compte pour connaitre les prochaines étapes.</p>
      
    
      
    <footer>
      <div role="button" class="outline" on:click={subscribeAnother}>Inscire quelqu'un d'autre</div>
      <div role="button" on:click={done}>Continuer</div>
    </footer>
  </article>
</dialog>
