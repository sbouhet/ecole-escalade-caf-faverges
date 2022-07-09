<script>
    /* -------------------------------------------------------------------
    This components displays a warning with the maximum age and minimum year based on a day input
    ex: "Ce créneau est reservé aux enfants de moins de 14 ans nés en 2012 ou avant."
    ex: "Ce créneaux est reservé aux adultes."
    -------------------------------------------------------------------  */
    import {BError} from 'berror'
    import {error, currentSeason, currentDay} from '$utils/stores'
    import {getMinYearFromAgeGroup} from '$utils/getMinYearFromAgeGroup'
    import InfoMessage from './InfoMessage.svelte'


    const getWarningMessage = (day) => {
        try {
            if (!day) throw new Error("No day")

            // get age group
            const ageGroup = $currentSeason.ageGroups[day.ageGroupIndex]

            // if adults
            if(ageGroup.min>=18) return "Ce créneaux est reservé aux adultes."

            // if children
            const maxAge = parseInt(ageGroup.max)
            const minYear = getMinYearFromAgeGroup(ageGroup)
            return `Ce créneau est reservé aux enfants de moins de ${maxAge+1} ans, nés en ${minYear} ou avant.`
            
        } catch (err) {
            const e = new BError("$components/forms/YearWarning => getWarningMessage()", err)
            e.log()
            $error=e
        }
    }

    const warningMessage = getWarningMessage($currentDay)
</script>

<InfoMessage msg={warningMessage} />