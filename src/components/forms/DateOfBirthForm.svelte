<script>
    import {getAge, getMinYear} from '../../utilities/ageGroups'
    import { currentDay, currentSeason } from '../../utilities/stores'
   
    $: ageGroup = $currentSeason.ageGroups[$currentDay.ageGroupIndex]
    let dateOfBirth
    let age
    let status
    $: if (dateOfBirth) {
        let year = parseInt(dateOfBirth.split('-')[0])
        if (year>1900) {
            age = getAge(dateOfBirth, false)
            if (ageGroup) {
                if (year > getMinYear(ageGroup)) {
                    status = 'too young'
                }else if(age > ageGroup.max) {
                    status = 'too old'
                }else{
                    status = 'ok'
                }
            }
        }
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
        {:else if status === 'too young'}
            <div class="red">
                <span>✕</span>
                <small>Votre enfant est né après {getMinYear(ageGroup)}, il est trop jeune pour ce groupe.</small>
            </div>
        {:else if status === 'too old'}
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