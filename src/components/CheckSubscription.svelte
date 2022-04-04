<script>
    import { subscription, currentDay, currentSeason } from '$utils/stores'
    import { getAge } from '$utils/ageGroups'
    import { getDayName } from '$utils/days'
    import { translateRole } from '$utils/translateRole'
    import { createNewStudent, getSeasonFromFirestore } from '$utils/firestore'
    import { printName } from '$utils/printName'



    const submitSubscription = () => {
      createNewStudent($subscription).then(()=>{
        $subscription.status = 'uploadedToFirestore'
      }).catch(err=>{
        $subscription.status = 'errorUploading'
        throw err
      })
    }
</script>

<dialog open>
  <article>
    <h2>Vérifiez vos informations</h2>
    <div>
      <h5>
        {printName($subscription)}
      </h5>
      <div>Né(e) le <b>{dayjs($subscription.dateOfBirth).format('D MMMM YYYY')}</b> ({getAge($subscription.dateOfBirth, false)} ans)</div>
      <div>Créneau choisi : <b>{getDayName($currentDay)}</b></div>
      <br>
      <section>
        Parents :
        {#each $subscription.parents as parent}
        <hr>
          <div>
            <div><b>{printName(parent)}</b> <small>({translateRole(parent.role)})</small></div>
            <div>Email : {parent.email===undefined?'':parent.email}</div>
            <div>Téléphone: {parent.tel===undefined?'':parent.tel}</div>
          </div>
        {/each}
      </section>
    </div>
    <footer>
      <a href="#" role="button" class="secondary" on:click={()=>$subscription.status=null}>Annuler</a>
      <a href="#" role="button" on:click={submitSubscription}>Confirmer l'inscription</a>
    </footer>
  </article>
</dialog>
