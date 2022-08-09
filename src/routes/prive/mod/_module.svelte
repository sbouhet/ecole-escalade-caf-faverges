<script>
    export let context //prevent warnings in console
    import { mod } from '$utils/stores'
    import Back from '$components/htmlElements/Back.svelte'
</script>

{#if $mod}
    <slot></slot>
  <!--   <Back /> -->
{:else}
    <p style="color:red">Vous devez être moderateur pour accéder à cette page</p>
{/if}

