<script>
    import {getAge, getMinYear} from '$utils/ageGroups'
    import { currentDay, currentSeason, subscription, ageStatus } from '$utils/stores'
   
    let dateOfBirth, age, status, invalid, year
    const ageGroup = $currentSeason.ageGroups[$currentDay.ageGroupIndex]
    const minYear = getMinYear(ageGroup)
    const ageMax = ageGroup.max
    const dateMax = `${minYear}-12-12`
    const dateMin = dayjs().subtract(ageMax+1, 'year').format("YYYY-MM-DD")
    let dif

    
    const updateStatus = ()=>{
        dif = dayjs(dateMin).diff(dayjs(dateOfBirth))

        if(year<1900){
            status = null
            invalid = null
            return
        }
        if (year > minYear) {
            status = 'tooYoung'
            invalid = true

        }else if(dif>0) {
            status = 'tooOld'
            invalid = true

        }else{
            status = 'ok'
            invalid = false
        }
    }

    // When user writes date of birth
    $: if(dateOfBirth) {

        // Get year
        year = parseInt(dateOfBirth.split('-')[0])
        
        // Get age
        age = getAge(dateOfBirth)

        // Update status
        updateStatus()

        // Update subscription
        $subscription.privateInfo.dateOfBirth = dateOfBirth
    }else{
        invalid = null
        status = null
    }
</script>

    <div>
        <label for="dateOfBirth">Date de naissance</label>
        <input type="date" required bind:value={dateOfBirth} aria-invalid={invalid} max={dateMax} min={dateMin}>
    </div>
    
    {#if status==='ok'}
        <div class='green'>
            <span>✓</span>
            <small>Votre enfant peut s'inscrire sur ce créneau.</small>
        </div>
    {:else if status === 'tooYoung'}
        <div class="red">
            <span>✕</span>
            <small>Votre enfant est né après {getMinYear(ageGroup)}, il est trop jeune pour ce groupe.</small>
        </div>
    {:else if status === 'tooOld'}
        <div class="red">
            <span>✕</span>
            <small>Votre enfant a {age} ans, il est trop agé pour ce groupe.</small>
        </div>
    {/if}
    
    

<style>
    span{
        font-size: x-large;
        font-weight: bold;
        margin-right: 0.1em;
    }
    .green{
        color:green;
    }
    .red{
        color:red;
    }
</style>