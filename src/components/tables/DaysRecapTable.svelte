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
<small>Cliquez sur un créneau pour plus d'informations.</small>
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