<script>
    import Back from '../../components/Back.svelte'
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import Logout from '../../components/Logout.svelte'
    import Login from '../../components/forms/Login.svelte'
    import VerifyEmail from '../../components/VerifyEmail.svelte'
    import {currentUser, loggedin, verified, admin} from '../../utilities/stores'
    import CreateAccount from '../../components/CreateAccount.svelte';
    
    const allowDebug = true
    let debug = true
    let userStoreUpToDate = false
    let showCreateAccount = true
    
    document.addEventListener('keydown', e=>{
        if (e.key==="Dead" && allowDebug) debug = !debug}
        )
        
    console.log('module starting')


    onAuthStateChanged(getAuth(), (usr)=>{
        console.log('authStateCHange starting')
        userStoreUpToDate = false
        $currentUser = getAuth().currentUser
      if(usr){
        //$currentUser = usr
        $loggedin = true
        $verified = usr.emailVerified
        usr.getIdTokenResult().then(res => {
          $admin = !!res.claims.admin
          userStoreUpToDate = true
        })
      }else{
        $loggedin = false
        //$currentUser = null
        $admin = false
        $verified = false
        userStoreUpToDate = true
        //refresh ??
      }
      
	  })

</script>
<body>
{#if debug}
    <div class="debug">
        <div>UserStoreUpToDate: {userStoreUpToDate}</div>
        <div>Loggedin: {$loggedin}</div>
        <div>Verified: {$verified}</div>
        <div>Admin: {$admin}</div>
        <div>User: {$currentUser}</div>
        {#if $loggedin}
            <div>Email: {$currentUser.email}</div>
        <div>Id: {$currentUser.uid}</div>
        {/if}
    </div>
{/if}

    
    
    <main class="container">

    {#if userStoreUpToDate}
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
    {:else}
        ... merci de patientez (si ca dur trop longtemps contactez Jules au 06 74 80 69 72)
    {/if}
        
        <Back />
        <Logout />
    </main>
</body>

<style>
    .debug{
        position: absolute;
        color: white;
        right: 0;
        background-color: rgba(0, 0, 0, 0.6);
    }
</style>