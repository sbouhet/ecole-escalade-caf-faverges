<script>
    import { getAgeGroupName } from '$utils/ageGroups';
    import { getDayName, getDayUrl } from '$utils/days';
import { _getDoc } from '$utils/firebase/firestore/basics';
    import { getDayStudents } from '$utils/firebase/firestore/getDayStudents';
    import { printName } from '$utils/printName';
    import {currentSeason} from '$utils/stores'
import { translate } from '$utils/TRANSLATE';
    let showOther = false
    let selectedDay, releventStudents, selectedStudent, privateInfo
    const releventDays= $currentSeason.days.filter(x=>x.weekday===dayjs().format('dddd'))
    
    const dayName = (day)=>{
        const ageGroup = $currentSeason.ageGroups[day.ageGroupIndex]
        return getAgeGroupName(ageGroup)
    }

    const updateStudents = async ()=>{
        releventStudents = await getDayStudents(getDayUrl(selectedDay), $currentSeason.name)
    }
    const getPrivateInfo = async (id)=>{
        privateInfo = await _getDoc('students', id, 'privateCol', 'privateDoc')
    }

    $:if(selectedDay){
        updateStudents()
    }

    $:if(selectedStudent){
        getPrivateInfo(selectedStudent.id)
    }
    
</script>

<h1>Accident</h1>


<strong>{dayjs().format('dddd')}</strong> :<br>
{#each releventDays as day}
    <a href="#" role="button" class="outline" on:click={()=>{selectedDay = day; selectedStudent = null}}>{dayName(day)}</a>
{/each}
<a href="#" role="button" class="secondary outline" on:click={()=>showOther=!showOther}>Autre</a>

{#if showOther}
    <br>
    {#each $currentSeason.days as day}
        <a href="#" role="button" class="outline" on:click={()=>{selectedDay = day; selectedStudent = null}}>{getDayName(day)}</a>
    {/each}
    <br>
{/if}

{#if selectedDay}
<br><br>
    <h3>{getDayName(selectedDay)}</h3>
    {#if releventStudents}
        {#each releventStudents as student}
            <a href="#" role="button" on:click={()=>selectedStudent = student}>{printName(student.data())}</a><br>
        {/each}
    {/if}
{/if}

{#if selectedStudent && privateInfo}
    <dialog open>
        <article>
            <h3>{printName(selectedStudent.data())}</h3>
            {#if privateInfo.data().accidentTel}
                <a href={`tel:${privateInfo.data().accidentTel}`} role="button">Personne à prévenir <br>{privateInfo.data().accidentTel}</a>
            {/if}
            {#if privateInfo.data().parents.length}
                {#each privateInfo.data().parents as parent}
                <a href={`tel:${parent.tel}`} role="button">{translate(parent.role)} <small>({printName(parent)})</small><br>{parent.tel}</a>
                {/each}
            {/if}
        <footer>
            <a href="#" role='button' class="secondary" on:click={()=>selectedStudent=null}>Fermer</a>
        </footer>
        </article>
    </dialog>
{/if}


<style>
    a{
        margin: 10px;
    }
    article{
        width:100%;
    }
</style>