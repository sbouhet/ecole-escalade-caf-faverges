<script>
    /*-----------------------------------------------------------------------------------------
    This components asks for date of birth and checks it
    It has a mim and max date values
    MIN > the student must be a certain age at the time of subscription
    MAX > the year of their birthday must not be higher than a value (minYear)
    -------------------------------------------------------------------------------------------*/
    import { validateDateOfBirth, getMinAndMaxDate } from '$utils/dateOfBirth'
    import { currentDay, currentSeason } from '$utils/stores'
    export let dateOfBirth
    let status
    const {minDate, maxDate} = getMinAndMaxDate($currentDay, $currentSeason)
    
    const updateStatus = ()=>{

        // Get year
        let year = parseInt(dateOfBirth.split('-')[0])

        // If user is not done writing the date, do not display age warning
        if(year<1900){
            status = {valid: null}
            return
        }

        status = validateDateOfBirth(dateOfBirth, $currentDay, $currentSeason)
        
    }

    // When user writes date of birth
    $: if(dateOfBirth) {

        // Update status + age + subscription
        updateStatus()
        
    // If no date input (or incomplete) remove warning
    }else{
        status = {valid: null}
    }
</script>


<div>
    <label for="dateOfBirth">Date de naissance</label>
    <input type="date" required bind:value={dateOfBirth} aria-invalid={!status.valid} max={maxDate} min={minDate}>
</div>
{#if status.valid !== null}     
    {#if status.valid}
        <div class="green">
            <span>✓</span>
            <small>{status.msg}</small>
        </div>
    {:else}
        <div class="red">
            <span>✕</span>
            <small>{status.msg}</small>
        </div>
    {/if}
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