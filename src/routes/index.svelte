<script>
      export let context //just to hide warning in console
    
    import { subscription, currentDay, currentSeason } from '$utils/stores'
    import { subscriptionReset } from '$utils/subscriptionReset'
    import DaysRecapTable from '$components/DaysRecapTable.svelte'

   

const reset = ()=>{
    $subscription = subscriptionReset($currentSeason)
}

</script>


<hgroup>
    <h1>École d'escalade</h1>
    <h1>Saison {$currentSeason.name}</h1>
</hgroup>


<a href="/prive/inscription" on:click={reset}>Inscription</a><br>
<a href="/prive/mon-compte">Mon compte</a><br>
<a href="/inscriptions-en-cours">Voir les inscriptions en cours</a><br><br>
<a href="/creneaux">Tous les créneaux</a><br><br>
<a href="/test">test</a><br>
<a href="/admin">ADMIN</a>

<section>
    <DaysRecapTable />
</section>

<slot></slot> <!-- just to hide error warning in console -->
