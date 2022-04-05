<script>
    import { currentSeason, currentDay, subscription, loggedin, verified, admin, currentUser, ageStatus} from '$utils/stores'
    import { getDayName } from '$utils/days'
    import { seasons } from '$utils/seasons'


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
        seasons.season.day : {$subscription.publicInfo.seasons[seasons().current].day}<br>
        seasons.season.status : {$subscription.publicInfo.seasons[seasons().current].status}<br>
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