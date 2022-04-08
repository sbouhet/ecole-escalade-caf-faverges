<script>
    export let context //just to hide warning in console
    import { subscription, currentSeason} from '$utils/stores'
    import { subscriptionReset } from '$utils/subscriptionReset'
    const reset = ()=>{
    $subscription = subscriptionReset($currentSeason)
}
</script>


<ul>
    <li><a href="/admin/copySeason">Copy season</a></li>
    <li><a href="/admin/manageAdmins">Manage admins</a></li>
    <a href="/prive/inscription" on:click={reset}>Inscription</a><br>
    <a href="/admin/test">test</a><br>
</ul>













