<script>
    import Back from '$components/Back.svelte'
    import { getDayName, getDayUrl, getMinYear, getDayInfo } from '$utils/days'
    import { getAgeGroupName } from '$utils/ageGroups'
    import { currentDay, currentSeason } from '$utils/stores'
    import { seasons } from '$utils/seasons'
    import { db } from "$utils/firebase"
    import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collectionGroup,
  collection,
  query,
  where,
  onSnapshot,
    } from "firebase/firestore"

    let students = []
    let dayInfo = []
    const q = query(collection(db, "students"), where(`seasons.${seasons().current}.status`, ">", ""))
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
        console.log(`Found ${students.length} students for this season`)
    })
    
</script>

<h1>Créneaux disponibles</h1>
<figure>
        <table role="grid">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Age</th>
                    <th scope="col">Places restantes</th>
                    <th scope="col">Inscrits</th>
                    <th scope="col">Moniteur</th>
                </tr>
            </thead>
            <tbody>
                {#each dayInfo as day}
                    <tr>
                        <th><a href="/creneaux/{day.url}"><button class="outline">{day.name}</button></a></th>
                        <td>
                            <span data-tooltip={day.tooltip}>{day.ageGroupName}</span>
                        </td>
                        <td><b>{day.spotsLeft}</b></td>
                        <td>{day.nbOfSubscibedStudents} / {day.nbMaxOfStudents}</td>
                        <td>{day.teacher}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </figure>


<slot></slot>


    <style>
        button{
            margin:0px;
            max-width: 200px;
            text-transform: capitalize;
        }
        b{
            font-size: larger;
        }
    </style>