<script>
    /*-----------------------------------------------------------------------------------------
    This components asks for date of birth and checks it
    It has a max date value
    They must be 18 at start first day
    -------------------------------------------------------------------------------------------*/
    import { currentDay } from '$utils/stores'
   
    export let dateOfBirth
    let status, invalid, year

    const firstDay = dayjs($currentDay.firstDay)
    const dateMax = firstDay.subtract(18, 'years').format("YYYY-MM-DD")

    
    const updateStatus = ()=>{

        // Get year
        year = parseInt(dateOfBirth.split('-')[0])

        // If user is not done writing the date, do not display age warning
        if(year<1900){
            status = null
            invalid = null
            return
        }

        // How much younger than the limit a student is
        // If it's positive, student is too young
        let dif = dayjs(dateOfBirth).diff(dayjs(dateMax))

        // If student is too young, display warning
        if (dif >= 0) {
            status = 'tooYoung'
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

        // Update status
        updateStatus()
        
    // If no date input (or incomplete) remove warning
    }else{
        invalid = null
        status = null
    }
</script>

    <div>
        <label for="dateOfBirth">Date de naissance</label>
        <input type="date" required bind:value={dateOfBirth} aria-invalid={invalid} max={dateMax}>
    </div>
    
    <div class={status==='tooYoung' ? '': 'hidden'}>
        <div class="red">
            <span>✕</span>
            <small>Vous êtes trop jeune pour ce groupe. Il faut être né avant le {dayjs(dateMax).format("DD/MM/YY")}</small>
        </div>
        <br>
    </div>


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
    .hidden{
        opacity: 0;
    }
</style>