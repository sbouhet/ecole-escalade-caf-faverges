<script>
    import { firebaseApp } from '$utils/firebase' //important, do not remove
    export let context //just to hide warning in console
    import { currentSeason, currentDay, subscription} from '$utils/stores'
    import { getSeasonFromFirestore } from '$utils/getSeasonFromFirestore'
   
 
    
    let promise = getSeasonFromFirestore().then(season=>{
        $currentSeason = season
    }).catch(err=>{
        throw err
    })
    $:day = $currentDay

    $:console.log($subscription)
    let proprieties
    $:if ($subscription) {
        proprieties = []
        for (const prop in $subscription) {
            proprieties.push(prop)
        }
        console.log(proprieties)
    }
    
    
    


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
   <div>
       Subscription :<br>
       {#each proprieties as prop}
            {prop}: {$subscription[prop]}<br>
       {/each}
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