<script>
    import { _getDoc, _query } from '$utils/firebase/firestore/basics'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { pointsWithStudents, nbOfRuns} from '$utils/contest'
    import {printName} from '$utils/printName'
    import {params} from '@roxi/routify'
    const catIndex = $params.categorie
    const eventId = $params.eventId
    
    let event, loading, categorie, points

    const getEvent = async () =>{
        loading = true
        event =  await _getDoc('events', eventId)
        categorie = event.data().categories[catIndex]
        loading = false
     }

     getEvent()

     const unsub = onSnapshot(doc(db, "events", eventId), (event) => {

         getEvent()
         if (event) {
             points = pointsWithStudents(event, catIndex, 1000)
         }
    })


</script>



{#if points}
    <h1>{categorie}</h1>
    <ol>
        {#each points as point}
            <li>
                <ul>
                    {#each  point.students as student}
                        <li>
                            {printName(student, event.data().participants.filter(x=>x.categorie==catIndex))}
                            &nbsp;&nbsp;
                            <small>
                                ({Math.floor(point.points)} points, {nbOfRuns(event, student.id)} voie{#if nbOfRuns(event, student.id) > 1}s
                                {/if}
                                )
                            </small>
                        </li>
                    {/each}
                </ul>
            </li>
        {/each}
    </ol>
{:else}
    Erreur: Pas d'evenement trouvé pour {eventId}
{/if}


<style>
    ul li{
        list-style: none;
    }
</style>