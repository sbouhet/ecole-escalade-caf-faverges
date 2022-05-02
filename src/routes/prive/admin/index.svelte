<script>
    export let context //just to hide warning in console
    import { subscription, currentSeason} from '$utils/stores'
    import { subscriptionReset } from '$utils/subscriptionReset'
    const reset = ()=>{
    $subscription = subscriptionReset($currentSeason)
}
</script>


<ul>
    <li><a href="/prive/admin/copySeason">Copy season</a></li>
    <li><a href="/prive/admin/manageAdmins">Manage admins</a></li>
    <li><a href="/prive/inscription" on:click={reset}>Inscription</a></li>
    <li><a href="/prive/admin/test">test</a></li>
    <li><a href="/prive/admin/allStudents">Tous les élèves</a></li>
    <li><a href="/prive/admin/modifyStudent">Modifier eleve</a></li>
    <li><a href="/prive/admin/payments">Voir les paiements</a></li>
</ul>













