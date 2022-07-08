<script>
    export let context
    import { onMount } from 'svelte'
    import { getDayFromUrl, getDayInfo } from '$utils/days'
    import { currentSeason, students } from '$utils/stores'
    import StudentsStatusTable from '$components/tables/StudentsStatusTable.svelte'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import {goto, params} from '@roxi/routify'
    import CheckIfPreviousStudent from "$components/modals/CheckIfPreviousStudent.svelte"
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
    
    let dayStudents = []
    $:dayStudents = $students.filter(x=>x.data().seasons[$currentSeason.name] != null && x.data().seasons[$currentSeason.name].day===dayUrl)
    //$:dayStudents = $students
    let error = null
   
    $: info = getDayInfo(day, $currentSeason, dayStudents)
    
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
    <div>Nombre de cours : <b>{info.nbOfSessions}</b></div>
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
        <a role="button" class="secondary">Inscription</a>
        <strong class="red">COMPLET</strong>
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