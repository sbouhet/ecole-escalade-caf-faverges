<script>
    export let context //prevent warnings in console
    import { admin, loggedin } from '$utils/stores'
    import Back from '$components/htmlElements/Back.svelte'
    import { goto } from '@roxi/routify'
</script>

{#if $admin}
    <slot></slot>
    <Back path='/prive/admin' msg='Retour à la page Admin'/>
{:else}
    <p style="color:red">Vous devez être admin pour accéder à cette page</p>
{/if}

