<script>
    import { firebaseApp } from '../utilities/firebase' //important, do not remove
    export let context //just to hide warning in console
    import { currentSeason, currentDay, subscription} from '../utilities/stores'
    import { getSeasonFromFirestore } from '../utilities/getSeasonFromFirestore'
   
 
    
    let promise = getSeasonFromFirestore().then(season=>{
        $currentSeason = season
    }).catch(err=>{
        throw err
    })
    $:day = $currentDay

    $:console.log($subscription)
    


</script>

{#await promise}

{:then season}
   <div>{$currentSeason.name}</div>
   <div>
       Day:
        {#if day}
             {day.weekday}
        {/if}
   </div>
   
    <slot></slot>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}




<style>
    div{
        
        color: rgba(0, 0, 0, 0.2);
    }
</style>