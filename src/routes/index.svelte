<script>
      export let context //just to hide warning in console
    
    import { subscription, currentDay, currentSeason, admin } from '$utils/stores'

    import DaysRecapTable from '$components/DaysRecapTable.svelte'

</script>


<hgroup>
    <h1>École d'escalade</h1>
    <h1>Saison {$currentSeason.name}</h1>
</hgroup>



<a href="/prive/mon-compte">Mon compte</a><br>
<a href="/inscriptions-en-cours">Voir les inscriptions en cours</a><br><br>
{#if $admin}
    <a href="/admin">ADMIN</a>
{/if}

<section>
    <DaysRecapTable />
</section>

<slot></slot> <!-- just to hide error warning in console -->
