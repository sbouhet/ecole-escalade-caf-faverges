<script>
    import { firebaseApp } from '$utils/firebase' //important, do not remove
    export let context //just to hide warning in console
    import Back from '$components/Back.svelte'
    import Logout from '$components/Logout.svelte'
    import Login from '$components/forms/Login.svelte'
    import VerifyEmail from '$components/VerifyEmail.svelte'
    import {loggedin, verified} from '$utils/stores'
    import CreateAccount from '$components/CreateAccount.svelte' 
    import {isActive} from '@roxi/routify'
    
    let showCreateAccount = $isActive('/prive/inscription')
</script>

{#if $loggedin}
    {#if $verified}
        <slot></slot>
    {:else}
        <VerifyEmail/>
    {/if}
{:else}
    {#if showCreateAccount}
        <CreateAccount bind:showCreateAccount={showCreateAccount}/>
    {:else}
        <Login bind:showCreateAccount={showCreateAccount}/>
    {/if}
{/if}