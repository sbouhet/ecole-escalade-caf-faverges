<script>
    import { currentSeason, currentDay, subscription, ageStatus} from '$utils/stores'
    import { getDayName } from '$utils/days'
    import { seasons } from '$utils/seasons'
    import { getAuth } from "firebase/auth"


    let proprietiesPublic
    let proprietiesPrivate
    $:if ($subscription) {
        proprietiesPublic = []
        for (const prop in $subscription.publicInfo) {
            proprietiesPublic.push(prop)
        }
        proprietiesPrivate = []
        for (const prop in $subscription.privateInfo) {
            proprietiesPrivate.push(prop)
        }
    }
</script>

<div class="debug">
    <span>Loggedin: {getAuth().currentUser!==null}</span>
    {#if getAuth().currentUser!==null}
        <span>Email: {getAuth().currentUser.email}</span>
        <div>Uid: {getAuth().currentUser.uid}</div>
    {/if}
    <div>
        $CurrentSeason :
        {#if $currentSeason}
            {$currentSeason.name}
        {/if}
    </div>
    <div>
        Selected day :
        {#if $currentDay}
            {getDayName($currentDay)}
        {/if}
    </div>
    <div>
        ageStatus : {$ageStatus}<br>
    </div>
    <div>
        Public :
        <ul>
            {#each proprietiesPublic as prop}
                {#if $subscription[prop] !== null}
                    <li>
                        {prop}: {$subscription.publicInfo[prop]}
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
    <div>
        Private :
        <ul>
            {#each proprietiesPrivate as prop}
                {#if $subscription[prop] !== null}
                    <li>
                        {prop}: {$subscription.privateInfo[prop]}
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
    <div>
        seasons.season.day : {$subscription.publicInfo.seasons[$currentSeason.name].day}<br>
        seasons.season.status : {$subscription.publicInfo.seasons[$currentSeason.name].status}<br>
    </div>
</div>

<style>
    .debug{
        position: sticky;
        top: 0;
        color: black;
        right: 0;
        /* background-color: rgba(0, 0, 0, 0.6); */
    }
    ul, li{
        color:black
    }
</style>