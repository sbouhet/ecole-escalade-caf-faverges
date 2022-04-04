<script>
  export let open = true
  import { subscription, currentDay, currentSeason } from '$utils/stores'
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
    firstName = $subscription.firstName
    subYear = $subscription.dateOfBirth ? $subscription.dateOfBirth.split('-')[0] : null
    subAge = $subscription.dateOfBirth ? getAge($subscription.dateOfBirth, false) : null
    if ($subscription.ageChecksOut === 'tooYoung') {
      title = 'Erreur : votre enfant est trop jeune pour ce groupe'
      message = `L'année de naissance maximum pour ce groupe est ${minYear}, votre enfant est né en ${subYear}`
    }else if ($subscription.ageChecksOut === 'tooOld') {
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
        class="outline secondary"
        on:click={()=>open=false}>
        J'ai compris
      </a>
      <!-- <a href="#confirm"
        role="button"
        on:click={()=>open=false}>
        Confirm
      </a> -->
    </footer>
  </article>
</dialog>

<style>
  .red{
    color:red;
  }
</style>