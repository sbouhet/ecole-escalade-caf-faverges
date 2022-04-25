<script>
    export let context //just to hide warning in console
    import { currentSeason, admin, loggedin } from '$utils/stores'
    import DaysRecapTable from '$components/DaysRecapTable.svelte'
</script>

<hgroup>
    <h1>École d'escalade</h1>
    <h1>Saison {$currentSeason.name}</h1>
</hgroup>

{#if $admin}
    <a href="/admin">ADMIN</a><br>
{/if}

{#if $loggedin}
    <a href="/prive/mon-compte" role="button" class="outline">Mon compte</a>
{:else}
    <a href="/prive/mon-compte" role="button" class="outline">Se connecter</a>
{/if}
<br><br>

<section>
    <DaysRecapTable />
</section>

<slot></slot> <!-- just to hide error warning in console -->
