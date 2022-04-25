<script>
    import {getAge, getMinYear} from '$utils/ageGroups'
    import { currentDay, currentSeason, subscription, ageStatus } from '$utils/stores'
   
    
    let ageGroup, dateOfBirth, age, status, invalid
    $: if ($currentDay) {
        ageGroup = $currentSeason.ageGroups[$currentDay.ageGroupIndex]
    }

    $: $ageStatus = status
    
    $: if (dateOfBirth) {
        console.log(dateOfBirth)
        let year = parseInt(dateOfBirth.split('-')[0])
        if (year>1900) {
            age = getAge(dateOfBirth, false)
            console.log(age)
            if (ageGroup) {
                if (year > getMinYear(ageGroup)) {
                    status = 'tooYoung'
                    invalid = true
                }else if(age > ageGroup.max) {
                    status = 'tooOld'
                    invalid = true
                }else{
                    status = 'ok'
                    invalid = false
                }
            }
        }
    $subscription.privateInfo.dateOfBirth = dateOfBirth
    }else{
        $subscription.privateInfo.dateOfBirth = null
        age= null
        status = null
        invalid = null
    }
</script>


    
    <div>
        <label for="dateOfBirth">Date de naissance</label>
        <input type="date" required bind:value={dateOfBirth} aria-invalid={invalid}>
    </div>
    
        {#if status==='ok'}
            <div class='green'>
                <span>✓</span>
                <small>Votre enfant a {age} ans, il peut s'inscrire sur ce créneau.</small>
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