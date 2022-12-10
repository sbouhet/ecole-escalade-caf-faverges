<script>
    import { _getDoc } from '$utils/firebase/firestore/basics'
    import StudentSelection from '$components/StudentSelection.svelte'
    import CategorieSelection from '$components/contest/CategorieSelection.svelte'
    import Routes from '$components/contest/Routes.svelte'
    import { printName } from '$utils/printName'
    import {params} from '@roxi/routify'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import Route from '$components/contest/Route.svelte';
    import RunConfirmation from '$components/contest/RunConfirmation.svelte';
    let eventId = $params.eventId
    let selectedCatIndex, selectedStudent, selectedRoute, loading, event, studentList, hidden

    const unsub = onSnapshot(doc(db, "events", eventId), () => {
        getEvent()
    })

    const getEvent = async ()=>{
        loading = true
        event = await _getDoc('events', eventId)
        loading = false
    }

    $:if (selectedCatIndex!=undefined && event) {
        studentList = event.data().participants.filter(x=>x.categorie==selectedCatIndex)
    }else if(event){
        studentList = event.data().participants
    }

    $:if (selectedRoute || selectedStudent) {
        window.scrollTo(0, 0);
    }
    
</script>


{#if loading}
    Merci de patienter
{:else}
    {#if event}
        {#if !selectedStudent}
            <CategorieSelection {event} bind:selectedCatIndex={selectedCatIndex}/>
            <br><br>
            <StudentSelection  {studentList} showAll=true firstNameOnly=true bind:selectedStudent={selectedStudent}/>
        {:else}
            <h3>{printName(selectedStudent)}</h3>
            {#if !selectedRoute}
                <Routes routes={event.data().routes} bind:selectedRoute={selectedRoute}/>
            {:else}
                
                <RunConfirmation route={selectedRoute} student={selectedStudent} {event}/>
            {/if}
        {/if}
    {:else}
        No event
    {/if}
{/if}