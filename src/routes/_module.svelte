<script>
    export let context //just to hide warning in console
    import { currentSeason } from '../utilities/stores'
    import { getSeasonFromFirestore } from '../utilities/getSeasonFromFirestore'
   
 
    
    let promise = getSeasonFromFirestore().then(season=>{
        $currentSeason = season
    }).catch(err=>{
        throw err
    })
</script>

{#await promise}

{:then season}
   <div>{$currentSeason.name}</div>
    <slot></slot>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}




<style>
    div{
        color: rgba(0, 0, 0, 0.2);
    }
</style>