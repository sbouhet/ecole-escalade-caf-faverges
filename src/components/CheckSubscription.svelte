<script>
    import { subscription, currentDay, currentSeason } from '$utils/stores'
    import { getAge } from '$utils/ageGroups'
    import { getDayName, getDayUrl } from '$utils/days'
    import { translateRole } from '$utils/TRANSLATE'
    import { createNewStudent } from '$utils/firestore'
    import { printName } from '$utils/printName'
    import { isDayFull } from '$utils/firestore'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    let error = null

    const submitSubscription =  () => {

      const dayUrl = $subscription.publicInfo.seasons[$currentSeason.name].day
      isDayFull(dayUrl, $currentSeason.name, $currentSeason.days).then(dayIsFull=>{
        if(dayIsFull){
          error = "Il n'y a plus de place sur ce créneaux."
          throw 'Day is full'
        }else{
          error=null
        }
      }).then(()=>{
        createNewStudent($subscription, $currentSeason).then((answer)=>{
        console.log(answer)
        $subscription.publicInfo.seasons[$currentSeason.name].status = 'uploadedToFirestore'
      }).catch(err=>{
        $subscription.publicInfo.seasons[$currentSeason.name].status = 'errorUploading'
        throw err
      })

      })


      
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
    {#if error}
      <ErrorMessage {error} />
    {/if}
    <footer>
      <a href="#" role="button" class="secondary" on:click={()=>$subscription.publicInfo.seasons[$currentSeason.name].status=null}>Annuler</a>
      <a href="#" role="button" on:click={submitSubscription}>Confirmer l'inscription</a>
    </footer>
    
  </article>
</dialog>
