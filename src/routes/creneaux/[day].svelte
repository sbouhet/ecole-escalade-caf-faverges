<script>
    export let context
    import { onMount } from 'svelte'
    import { getDayFromUrl, getDayInfo } from '$utils/days'
    import { currentSeason, students } from '$utils/stores'
    import StudentsStatusTable from '$components/tables/StudentsStatusTable.svelte'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import {goto, params} from '@roxi/routify'
    import CheckIfPreviousStudent from "$components/modals/CheckIfPreviousStudent.svelte"
    import { getAuth } from "firebase/auth"
    import { _updateDoc} from '$firestore/basics'
    import { arrayUnion } from 'firebase/firestore'

    let loading = false
    let done = false
    let dayUrl = $params.day
    let openModal= false
    let day = getDayFromUrl(dayUrl, $currentSeason.days)
    let today = dayjs()
    onMount(() => {
		const interval = setInterval(() => {
			today = dayjs();
		}, 1000);

		return () => {
			clearInterval(interval);
		}
	})
    const dateOfNoRestriction = dayjs($currentSeason.dateOfNoRestriction)
    $:timeUntilNoRestrictions = dateOfNoRestriction.diff(today, "seconds")

    const resubscriptionDate = dayjs($currentSeason.resubscriptionDate)
    $:timeUntilResubscription = resubscriptionDate.diff(today, "seconds")
    
    let dayStudents = []
    $:dayStudents = $students.filter(x=>x.data().seasons[$currentSeason.name] != null && x.data().seasons[$currentSeason.name].day===dayUrl)
    //$:dayStudents = $students
    let error = null
   
    $: info = getDayInfo(day, $currentSeason, dayStudents)
    let waitingListEmail
    $:if(getAuth().currentUser) waitingListEmail = getAuth().currentUser.email
    const addEmailToWaitlist = async()=>{
        try {
            if(loading)return
            loading = true
            done = false
            const result = await _updateDoc({[dayUrl]:arrayUnion(waitingListEmail)}, "waitlist", $currentSeason.name)
            done = true
            console.log("done")
        }catch (error) {
            console.error(error)
        }
        loading = false
    }
</script>

<CheckIfPreviousStudent open={openModal} {dayUrl}/>

<hgroup>
    <h1>{info.name}</h1>
    <h4>{dayStudents.length} inscrits pour l'instant</h4>
</hgroup>

<section>
    <div>Horaires : <b>{info.times}</b></div>
    <div>Ages : <b data-tooltip={info.tooltip}>{info.ages}</b></div>
    <div>Places restantes: <b class="{info.spotsLeft <= 0 ? 'red' : 'green'}">{info.spotsLeft}</b></div>
    <div>Inscrits : <b class="{info.spotsLeft <= 0 ? 'red' : 'green'}">{info.nbOfSubscibedStudents} / {info.nbMaxOfStudents}</b></div>
    {#if info.teacher === 'Jelena'}
        <div>Monitrice: <b>{info.teacher}</b></div>
    {:else}
        <div>Moniteur: <b>{info.teacher}</b></div>
    {/if}
    <div>Début des cours : <b>{dayjs(info.firstDay).format("dddd D MMMM YYYY")}</b></div>
    <div>Fin des cours : <b>{dayjs(info.lastDay).format("dddd D MMMM YYYY")}</b></div>
    <!-- <div>Nombre de cours : <b>{info.nbOfSessions}</b></div> -->
    <div>
        Prix <span data-tooltip="Adhésion au club obligatoire.">(hors licence)</span> : 
        <b>{info.price}€</b>
         ({Math.floor(info.price/info.nbOfSessions*100)/100}€ par cours)
    </div>
</section>

<section>

    {#if info.spotsLeft>0}
        {#if timeUntilNoRestrictions > 0}
            <div role="button" on:click={()=>openModal=true}>Inscription</div>
        {:else}
            <div role="button" on:click={$goto("/prive/inscription/[dayUrl]", {dayUrl})}>Inscription</div>
        {/if}
    {:else}
        <strong class="red" style="font-size: xx-large;">Ce créneau est complet</strong><br>
        Si une place se libère, nous enverrons un email aux personnes inscrites sur la liste d'attente.
    
        <br><br>
        <form on:submit|preventDefault={addEmailToWaitlist}>
            <label for="waitingListEmail">Adresse email</label>
            <div style="display: flex;">
                <input type="email" name="waitingListEmail" bind:value={waitingListEmail} style="max-width: 300px;" required>
                <button aria-busy={loading} style="max-width: 300px; margin-left:20px">S'inscire sur la liste d'attente</button>
            </div>
            {#if done}
                ✅  <span style="color:green"> Vous êtes inscrit sur la liste d'attente</span>
            {/if}
        </form>
    {/if}
</section>

<progress value={info.nbOfSubscibedStudents} max={info.nbMaxOfStudents}></progress>
<section>
    <StudentsStatusTable students={dayStudents} showDay={false}/>
</section>

{#if error}
    <ErrorMessage {error}/>
{/if}

<slot></slot>
<style>
    h1{
        text-transform: capitalize;
    }
   .red{
       color:red;
   }
   .green{
       color:green;
   }
</style>