<script>
    import { getDayInfo } from '$utils/days'
    import { currentSeason, students } from '$utils/stores'
    import Tooltip from '$components/htmlElements/Tooltip.svelte'
    import { goto } from '@roxi/routify'

    let days = []
    let someFull = false

    //Get information on days
    $:if($currentSeason && $students){
        days = []
        someFull = false
        for (const day of $currentSeason.days) {
            const dayInfo = getDayInfo(day, $currentSeason, $students)
            days.push(dayInfo)
            if(dayInfo.spotsLeft <= 0) someFull = true
        }
    }


   
</script>

<div>
    <strong>Créneaux disponibles</strong>
</div>
<small>Cliquez sur un créneau pour plus d'informations.
<br><br>
<b>Attention</b>
<br>Pour les cours Adultes: le lundi pour les débutants, le mercredi pour les confirmés
<br>Pour les cours 8-10 ans: le lundi pour les débutants et le mercredi pour les 2ème et 3ème année d'escalade
<br>Durée des cours:
<br>6-7 ans: 1h
<br>8-10 ans: 1h
<br>11-13 ans: 1h30
<br>14-17 ans et adultes confirmés: 2h dont 1/2h d'échauffement en autonomie
<br>
<b>Certains emails peuvent arriver dans votre dossier Spam/Indésirable. Pensez à vérifier</b>
</small>
<br>
<br>


<figure>
        <table role="grid">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Âges</th>
                    <th scope="col">Places restantes</th>
                    <th scope="col">Inscrits</th>
                    <th scope="col">Moniteur</th>
                </tr>
            </thead>
            <tbody>
                {#each days as day}
                    <tr on:click={$goto("/creneaux/[day]", {day:day.url})} class="row">
                        <!-- Name -->
                        <th>
                            <a href="/creneaux/{day.url}"  class="outline">{day.name}</a>
                        </th>
                        <!-- Ages -->
                        <td>
                            <span data-tooltip={day.tooltip}>{day.ageGroupName}</span>
                        </td>
                        <!-- Spots left -->
                        <td>
                            {#if day.spotsLeft > 0}
                                <b class="green">{day.spotsLeft}</b>
                            {:else}
                                <b class="red">COMPLET</b>
                            {/if}
                        </td>
                        <!-- Number of subscriptions -->
                        <td class="{day.spotsLeft <= 0 ? 'red' : 'green'}">
                            <Tooltip list={day.studentList}>
                                 {day.nbOfSubscibedStudents} / {day.nbMaxOfStudents}
                            </Tooltip>
                        </td>
                        <!-- Teacher -->
                        <td>
                            {day.teacher}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </figure>

    {#if someFull}
        <small style="color:red">
            Certains créneaux sont complets, vous pouvez cependant vous inscrire sur liste d'attente en cliquant dessus.
        </small>
    {/if}

<slot></slot>


<style>
    a{
        text-transform: capitalize;
    }
    b{
        font-size: larger;
    }
    .red{
        color:red;
    }
    .green{
        color:green;
    }

</style>