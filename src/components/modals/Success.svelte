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
      const id = $subscription.id
      $subscription = subscriptionReset($currentSeason)
      $subscriptionStatus = null
      $goto('/prive/mon-compte/[id]', {id})
    }

  
</script>

<dialog open={open}>
  <article>
    <h2>Votre demande d'inscription a bien été enregistrée !</h2>
    <p><b>{printName($subscription.publicInfo)}</b> est pré‑inscrit·e sur le créneau de {getDayName($currentDay)}.</p>
    <div>
      <strong style="color:red"> Attention !</strong><br>
      Il reste plusieurs étapes pour finaliser votre inscription :
    </div>
    <br>
      <ul>
        <li>Payer les cours</li>
        <li>Prendre une licence au CAF de Faverges</li>
        <li>Transférer un certificat médical</li>
      </ul>
    
    <div>
      Vous avez jusqu'au <b>{dayjs($currentSeason.deadline).format("dddd D MMMM à HH:mm")}</b> pour finaliser votre inscription.
      <span style="color:red">Après cette date, votre place sera libérée et proposée aux personnes inscrites sur la liste d'attente.</span>
    </div>
    <br>
    <p>Accédez à votre compte pour finaliser l'inscription.</p>
      
    <footer>
      <div role="button" class="outline" on:click={subscribeAnother}>Inscire quelqu'un d'autre</div>
      <div role="button" on:click={done}>Finaliser l'inscription</div>
    </footer>
  </article>
</dialog>
