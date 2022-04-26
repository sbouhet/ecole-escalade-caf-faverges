<script>
    export let context
    import { db } from "$utils/firebase/firebase"
    import {collection,query,where,onSnapshot} from "firebase/firestore"
    import { getDayFromUrl, getDayInfo, getDayName } from '$utils/days'
    import { currentSeason, subscription, students } from '$utils/stores'
    import StudentsStatusTable from '$components/StudentsStatusTable.svelte'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import {goto, params} from '@roxi/routify'
    import { seasons } from "$utils/seasons";
    let dayUrl = $params.day
    let day = getDayFromUrl(dayUrl, $currentSeason.days)
    
    let dayStudents = []
    $:dayStudents = $students.filter(x=>x.seasons[$currentSeason.name].day===dayUrl)
    //$:dayStudents = $students
    let error = null
   
    $: info = getDayInfo(day, $currentSeason, dayStudents)
    
</script>

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
    <div>Début des cours : <b>{info.firstDay}</b></div>
    <div>Fin des cours : <b>{info.lastDay}</b></div>
    <div>Nombre de cours : <b>{info.nbOfSessions}</b></div>
    <div>
        Prix <span data-tooltip="Adhésion au club obligatoire.">(hors licence)</span> : 
        <b>{info.price}€</b>
         ({Math.floor(info.price/info.nbOfSessions*100)/100}€ par cours)
    </div>
</section>

<section>
    {#if info.spotsLeft>0}
        <div role="button" on:click={$goto("/prive/inscription/[dayUrl]", {dayUrl})}>Inscription</div>
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