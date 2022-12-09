<script>
    import { _getDoc, _getDocs, _updateDoc } from '$utils/firebase/firestore/basics'
    import { arrayRemove, doc, onSnapshot, arrayUnion } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import {params} from '@roxi/routify'
    import { printName } from '$utils/printName';
    import StudentSelection from '$components/StudentSelection.svelte'
    const eventId = $params.id

    let event, loading, selectedStudent, selectedCategorie
 
    const getEvent = async() =>{
        loading = true
        event = await _getDoc('events', eventId)
        loading = false
    }

    const unsub = onSnapshot(doc(db, "events", eventId), (event) => {
           getEvent()
    })

    const delPax = async (event, pax) =>{
        await _updateDoc({participants:arrayRemove(pax)}, 'events', event.id)
    }

    const addPax = async (event, pax, catIndex) =>{
       
        selectedStudent = undefined
        selectedCategorie = undefined
        await _updateDoc({participants:arrayUnion({
            categorie:catIndex,
            firstName:pax.data().firstName,
            lastName:pax.data().lastName,
            id:pax.id,
        })}, 'events', event.id)
        selectedStudent = undefined
    }

    $:if(selectedStudent && selectedCategorie!=undefined){
        console.log('penis');
        addPax(event, selectedStudent, selectedCategorie)
    }
   
   const selectCategorie = (catIndex)=>{
    if (selectedCategorie == catIndex) {
        selectedCategorie = undefined
    } else {
        selectedCategorie = catIndex
    }
   }
</script>

{#if event}
    <hgroup>
        <h1>Rajouter ou supprimer des participants</h1>
        <h2>{event.data().title}</h2>
    </hgroup>
    {#each event.data().categories as cat, i}
        <div class='cat'>
            <hgroup>
                <h4>{cat}</h4>
                <h5>{event.data().participants.filter(x=>x.categorie==i).length} participants</h5>
            </hgroup>
            <ul>
                {#each event.data().participants.filter(x=>x.categorie==i) as pax}
                    <li>
                        {printName(pax, event.data().participants)}
                        <a href="#" on:click={()=>delPax(event, pax)}>🗑️</a>
                        <br>
                    </li>
                {/each}
                <li>
                    <a href="#" on:click={()=>selectCategorie(i)}>➕ Ajouter</a>
                </li>
            </ul>
            {#if selectedCategorie==i}
                <StudentSelection bind:selectedStudent={selectedStudent}/>
            {/if}
        </div>
    {/each}
{/if}


<style>
    ul li{
        list-style: none;
    }

    ul{
        border-left: 1px solid black;
        padding: 10px;
    }



</style>