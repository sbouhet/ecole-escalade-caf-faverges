<script>
    export let context //just to hide warning in console
    import { currentSeason, admin, loggedin, mod } from '$utils/stores'
    import DaysRecapTable from '$components/tables/DaysRecapTable.svelte'
</script>

<hgroup>
    <h1>École d'escalade</h1>
    <h1>Saison {$currentSeason.name}</h1>
</hgroup>

{#if $admin}
    <a href="/prive/admin" role="button"  class="admin">Admin</a>
{/if}
{#if $mod}
    <a href="/prive/mod" role="button"  class="mod">Moderateur</a>
{/if}

{#if $loggedin}
    <a href="/prive/mon-compte" role="button" class="outline">Mes inscriptions</a>
{:else}
    <a href="/prive/mon-compte" role="button" class="outline">Se connecter</a>
    <a href="/prive/mon-compte?showCreateAccount=true" role="button" class="outline">Créer un compte</a>
{/if}
<br><br>

<section>
    <DaysRecapTable />
</section>

<slot></slot> <!-- just to hide error warning in console -->

<style>
    .admin{
        background-color: rgb(224, 39, 39);
        border: 0;
    }

    .mod{
        background-color: rgb(224, 181, 39);
        border: 0;
    }
</style>