<script>
    import { currentSeason, currentDay, subscription, loggedin, verified, admin, currentUser, ageStatus} from '$utils/stores'
    import { getDayName } from '$utils/days'
    import { seasons } from '$utils/seasons'


    let proprieties
    $:if ($subscription) {
        proprieties = []
        for (const prop in $subscription) {
            proprieties.push(prop)
        }
    }
</script>

<div class="debug">
    <span>Loggedin: {$loggedin}</span>
    <span>Verified: {$verified}</span>
    <span>Admin: {$admin}</span>
    <span>User: {$currentUser}</span>
    {#if $loggedin}
        <span>Email: {$currentUser.email}</span>
        <!-- <div>Id: {$currentUser.uid}</div> -->
    {/if}
    <div>
        Season :
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
        Subscription :
        <ul>
            {#each proprieties as prop}
                {#if $subscription[prop] !== null}
                    <li>
                        {prop}: {$subscription[prop]}
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
    <div>
        seasons.season.day : {$subscription.seasons[seasons().current].day}<br>
        seasons.season.status : {$subscription.seasons[seasons().current].status}<br>
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