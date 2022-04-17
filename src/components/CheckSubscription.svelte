<script>
    import { subscription, currentDay, currentSeason } from '$utils/stores'
    import { getAge } from '$utils/ageGroups'
    import { getDayName, getDayUrl } from '$utils/days'
    import { translateRole } from '$utils/TRANSLATE'
    import { createNewStudent } from '$firestore/createNewStudent'
    import { printName } from '$utils/printName'
    import { isDayFull } from '$firestore/dayIsFull'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import { BError } from "berror"
    let full = false
    let loading = false

    const submitSubscription =  async () => {
      try {
        loading = true
        const dayUrl = $subscription.publicInfo.seasons[$currentSeason.name].day
        full = await isDayFull(dayUrl, $currentSeason.name, $currentSeason.days)
        if(full) throw "Day is full"
        const s = await createNewStudent($subscription, $currentSeason)
        $subscription.publicInfo.seasons[$currentSeason.name].status = 'uploadedToFirestore'
        loading = false
      } catch (err) {
        loading = false
        throw new BError("Error creating new student", err).log()
      }
    }
</script>

<dialog open>
  <article>
    <h2>Vérifiez vos informations</h2>
    <div>
      <h5>
        {printName($subscription.publicInfo)}
      </h5>
      <div>Né(e) le <b>{dayjs($subscription.privateInfo.dateOfBirth).format('D MMMM YYYY')}</b> ({getAge($subscription.privateInfo.dateOfBirth, false)} ans)</div>
      <div>Créneau choisi : <b>{getDayName($currentDay)}</b></div>
      <br>
      <section>
        Parents :
        {#each $subscription.privateInfo.parents as parent}
        <hr>
          <div>
            <div><b>{printName(parent)}</b> <small>({translateRole(parent.role)})</small></div>
            <div>Email : {parent.email===undefined?'':parent.email}</div>
            <div>Téléphone: {parent.tel===undefined?'':parent.tel}</div>
          </div>
        {/each}
      </section>
    </div>
    {#if full}
      <ErrorMessage error="Il n'y a plus de place sur ce créneau" />
      <footer>
        <a href="#" role="button" class="secondary" on:click={()=>$subscription.publicInfo.seasons[$currentSeason.name].status=null}>Annuler</a>
        <a href="/" role="button">Choisir un autre créneau</a>
      </footer>
    {:else}
      <footer>
        <a href="#" role="button" class="secondary" on:click={()=>$subscription.publicInfo.seasons[$currentSeason.name].status=null}>Annuler</a>
        {#if loading}
          <a href="#" role="button"  aria-busy={true}>Merci de patienter...</a>
        {:else}
          <a href="#" role="button" on:click={submitSubscription}>Confirmer l'inscription</a>
        {/if}
      </footer>
    {/if}
    
  </article>
</dialog>
