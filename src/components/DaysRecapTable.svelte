<script>
    import { getDayInfo } from '$utils/days'
    import { currentSeason, students } from '$utils/stores'
    import Tooltip from '$components/Tooltip.svelte'
    import { goto } from '@roxi/routify'

    let days = []

    //Get information on days
    $:if($currentSeason && $students){
        for (const day of $currentSeason.days) {
            days.push(getDayInfo(day, $currentSeason, $students))
        }
    }
   
</script>

<div>
    <strong>Créneaux disponibles</strong>
</div>
<small>Cliquez sur un créneau pour plus d'informations.</small>
<br><br>

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
                    <tr on:click={$goto("/creneaux/[day]", {day:day.url})}>
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
    thead th{
        font-weight: bold;
    }

    td{
        text-align: center;
    }
    tr:hover{
        background-color: var(--myColor);
        cursor: pointer;
    }
    [data-theme=light] {
    --myColor: red;
    }
    [data-theme=dark] {
    --myColor: green;
    }
</style>