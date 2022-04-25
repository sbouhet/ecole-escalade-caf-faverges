<script>
  export let open = true
  import { subscription, currentDay, currentSeason, ageStatus } from '$utils/stores'
  import { getDayName, getMinYear } from '$utils/days'
  import { getAge } from '$utils/ageGroups'
  import { capitalize } from '$utils/capitalize'

  let day, minYear, maxAge, subYear, subAge, firstName, title, message
  $:if ($currentDay) {
    day = getDayName($currentDay)
    minYear = getMinYear($currentDay, $currentSeason.ageGroups)
    maxAge = $currentSeason.ageGroups[$currentDay.ageGroupIndex].max
  }
  $:if ($subscription) {
    firstName = $subscription.publicInfo.firstName
    subYear = $subscription.privateInfo.dateOfBirth ? $subscription.privateInfo.dateOfBirth.split('-')[0] : null
    subAge = $subscription.privateInfo.dateOfBirth ? getAge($subscription.privateInfo.dateOfBirth, false) : null
    if ($ageStatus === 'tooYoung') {
      title = 'Erreur : votre enfant est trop jeune pour ce groupe'
      message = `L'année de naissance maximum pour ce groupe est ${minYear}, votre enfant est né en ${subYear}`
    }else if ($ageStatus === 'tooOld') {
      title = 'Erreur : votre enfant est trop agé pour ce groupe'
      message = `L'age maximum pour ce groupe est de ${maxAge} ans, ${capitalize(firstName)} a ${subAge} ans.`
    }
  }
</script>

<dialog open={open}>
  <article>
      <a href="#"
      aria-label="Close"
      class="close"
      on:click={()=>open=false}>
    </a>
    <h3>{title}</h3>
    <p class="red">
      ✕ {message}
    </p>
    <footer>
      <a href="#"
        role="button"
        class="outline contrast"
        on:click={()=>open=false}>
        J'ai compris
      </a>
    </footer>
  </article>
</dialog>

<style>
  .red{
    color:red;
  }
</style>