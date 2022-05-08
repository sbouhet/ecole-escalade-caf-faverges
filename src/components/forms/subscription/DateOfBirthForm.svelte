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

    const firstDay = dayjs($currentDay.firstDay)
    const ageGroup = $currentSeason.ageGroups[$currentDay.ageGroupIndex]
    const minYear = getMinYear(ageGroup)
    const ageMax = ageGroup.max
    let dateMax = `${minYear}-12-31`
    let dateMin = firstDay.subtract(ageMax+1, 'year').format("YYYY-MM-DD")
    //If adult
    if(!ageMax){
        dateMax = firstDay.subtract(18, 'year').format("YYYY-MM-DD")
        dateMin = null
    }
    
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
        age = getAge(dateOfBirth, false, firstDay)

        // How much older than the limit a student is
        // If it's positive, student is too old
        let dif = dayjs(dateMin).diff(dayjs(dateOfBirth))

        // How much younger than the limit a student is
        // If it's positive, student is too young
        let dif2 = dayjs(dateOfBirth).diff(dayjs(dateMax))

        // If student is too young, display warning
        if (dif2 > 0) {
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
            <small>Date de naissance valide.</small>
        </div>
    {:else if status === 'tooYoung'}
        <div class="red">
            <span>✕</span>
            {#if !ageMax}
                <small>Il faut être majeur à la date du premier cours pour s'inscrire.</small>
            {:else}    
                <small>Votre enfant est né après {minYear}, il est trop jeune pour ce groupe.</small>
            {/if}
        </div>
    {:else if status === 'tooOld'}
        <div class="red">
            <span>✕</span>
            <small>Votre enfant aura {age} ans au premier cours, il est trop agé pour ce groupe.</small>
        </div>
    {/if}
    <br>

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