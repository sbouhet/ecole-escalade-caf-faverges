<script>
    import {getAge, getMinYear} from '$utils/ageGroups'
    import { currentDay, currentSeason, subscription, ageStatus } from '$utils/stores'
   
    
    let ageGroup, dateOfBirth, age, status
    $: if ($currentDay) {
        ageGroup = $currentSeason.ageGroups[$currentDay.ageGroupIndex]
    }

    $: $ageStatus = status
    
    $: if (dateOfBirth) {
        let year = parseInt(dateOfBirth.split('-')[0])
        if (year>1900) {
            age = getAge(dateOfBirth, false)
            if (ageGroup) {
                if (year > getMinYear(ageGroup)) {
                    status = 'tooYoung'
                }else if(age > ageGroup.max) {
                    status = 'tooOld'
                }else{
                    status = 'ok'
                }
            }
        }
        
    $subscription.dateOfBirth = dateOfBirth
        
    }
</script>


    
    <div>
        <label for="dateOfBirth">Date de naissance</label>
        <input type="date" required bind:value={dateOfBirth}>
    </div>
    {#if dateOfBirth && status && age && ageGroup}
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