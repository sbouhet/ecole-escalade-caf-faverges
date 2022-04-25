<script>
    import { firebaseApp } from '$utils/firebase/firebase' //important, do not remove
    export let context //just to hide warning in console
    import Login from '$components/forms/Login.svelte'
    import VerifyEmail from '$components/VerifyEmail.svelte'
    import CreateAccount from '$components/CreateAccount.svelte' 
    import {isActive} from '@roxi/routify'
    import { getAuth } from "firebase/auth"
    import { loggedin } from '$utils/stores';
    
    let showCreateAccount = $isActive('/prive/inscription')
</script>

{#if $loggedin}
    {#if getAuth().currentUser.emailVerified }
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