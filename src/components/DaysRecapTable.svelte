<script>
    import Back from '$components/Back.svelte'
    import { getDayName, getDayUrl, getMinYear, getDayInfo } from '$utils/days'
    import { getAgeGroupName } from '$utils/ageGroups'
    import { currentDay, currentSeason, students } from '$utils/stores'
    import { seasons } from '$utils/seasons'
    import { db } from "$utils/firebase/firebase"
    import {
  collection,
  query,
  where,
  onSnapshot,
    } from "firebase/firestore"

    /* let students = []
    let dayInfo = []
    const q = query(collection(db, "students"), where(`seasons.${$currentSeason.name}.status`, ">", ""))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        students = []
        dayInfo = []
        querySnapshot.forEach((studentDoc) => {
            students.push(studentDoc.data())
        })
        for (const day of $currentSeason.days) {
            dayInfo.push(getDayInfo(day, $currentSeason, students))
        }
        dayInfo = dayInfo
        //console.log(`Found ${students.length} students for this season`)
    }) */
    let dayInfo = []
    $:if(true){
        for (const day of $currentSeason.days) {
            dayInfo.push(getDayInfo(day, $currentSeason, $students))
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
                {#each dayInfo as day}
                    <tr>
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
                            {day.nbOfSubscibedStudents} / {day.nbMaxOfStudents}
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
    </style>