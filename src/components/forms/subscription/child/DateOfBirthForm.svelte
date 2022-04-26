<script>
    /*-----------------------------------------------------------------------------------------
    This components asks for date of birth and checks it
    It has a mim and max date values
    MIN > the student must be a certain age at the time of subscription
    MAX > the year of their birthday must not be higher than a value (minYear)
    -------------------------------------------------------------------------------------------*/
    import {getAge, getMinYear} from '$utils/ageGroups'
    import { currentDay, currentSeason } from '$utils/stores'
   
    export let dateOfBirth
    let age, status, invalid, year
    const ageGroup = $currentSeason.ageGroups[$currentDay.ageGroupIndex]
    const minYear = getMinYear(ageGroup)
    const ageMax = ageGroup.max
    const dateMax = `${minYear}-12-12`
    const dateMin = dayjs().subtract(ageMax+1, 'year').format("YYYY-MM-DD")

    
    const updateStatus = ()=>{

        // Get year
        year = parseInt(dateOfBirth.split('-')[0])

        // If user is not done writing the date, do not display age warning
        if(year<1900){
            status = null
            invalid = null
            return
        }

        // Get age (without decimal)
        age = getAge(dateOfBirth, false)

        // How much older than the limit a student is
        // If it's positive, student is too old
        let dif = dayjs(dateMin).diff(dayjs(dateOfBirth))

        // If student is too young, display warning
        if (year > minYear) {
            status = 'tooYoung'
            invalid = true
        }
        // If student is too old, display warning
        else if (dif >= 0) {
            status = 'tooOld'
            invalid = true
        }
        // If student is right age, display success and update subscription
        else{
            status = 'ok'
            invalid = false
        }
    }

    // When user writes date of birth
    $: if(dateOfBirth) {

        // Update status + age + subscription
        updateStatus()
        
    // If no date input (or incomplete) remove warning
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
            <small>Votre enfant a {age} ans, il peut s'inscrire sur ce créneau.</small>
        </div>
    {:else if status === 'tooYoung'}
        <div class="red">
            <span>✕</span>
            <small>Votre enfant est né après {minYear}, il est trop jeune pour ce groupe.</small>
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