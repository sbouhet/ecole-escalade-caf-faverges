<script>
    /* -------------------------------------------------------------------
    This components displays a warning with the minimum year based on a day input
    ex: "Ce créneau est reservé aux enfants nés en 2012 ou avant."
    ex: "Ce créneaux est reservé aux adultes."
    -------------------------------------------------------------------  */
    import {BError} from 'berror'
    import {error, currentSeason, currentDay} from '$utils/stores'
    import {getMinYearFromAgeGroup} from '$utils/getMinYearFromAgeGroup'


    const getWarningMessage = (day) => {
        try {
            if (!day) throw new Error("No day")

            // get age group
            const ageGroup = $currentSeason.ageGroups[day.ageGroupIndex]

            // if adults
            if(ageGroup.min>=18) return "Ce créneaux est reservé aux adultes."

            // if children
            const minYear = getMinYearFromAgeGroup(ageGroup)
            return `Ce créneau est reservé aux enfants nés en ${minYear} ou avant.`
            
        } catch (err) {
            const e = new BError("$components/forms/YearWarning => getWarningMessage()", err)
            e.log()
            $error=e
        }
    }

    const warningMessage = getWarningMessage($currentDay)
</script>

<div>
    <span>ℹ</span>
    <small><i>{warningMessage}</i></small>
</div>

<style>
    span{
        margin-right: 5px;
        opacity: 0.5;
    }
    div{
        margin-bottom: 20px;
    }
</style>