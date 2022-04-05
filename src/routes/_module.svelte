<script>
    import { firebaseApp } from '$utils/firebase' //important, do not remove
    export let context //just to hide warning in console
    import { getAuth, onAuthStateChanged } from "firebase/auth"
    import { getSeasonFromFirestore } from '$utils/firestore'
    import {currentUser, loggedin, verified, admin, currentSeason} from '$utils/stores'
    import Debug from '$components/Debug.svelte'
    import Back from '$components/Back.svelte'
    import Logout from '$components/Logout.svelte'
    import {isActive} from '@roxi/routify'
    import { doc, onSnapshot } from "firebase/firestore"
    import { seasons } from '$utils/seasons'
    import { db } from '$utils/firebase'

   
 
    const allowDebug = true
    let debug = false
    document.addEventListener('keydown', e=>{
        if (e.key==="Dead" && allowDebug) debug = !debug}
    )
    
    let userStoreUpToDate = false

    onAuthStateChanged(getAuth(), (usr)=>{
        userStoreUpToDate = false
        $currentUser = getAuth().currentUser
      if(usr){
        $loggedin = true
        $verified = usr.emailVerified
        usr.getIdTokenResult().then(res => {
          $admin = !!res.claims.admin
          userStoreUpToDate = true
        })
      }else{
        $loggedin = false
        $currentUser = null
        $admin = false
        $verified = false
        userStoreUpToDate = true
        //refresh ??
      }
      
	  })


    let promise = getSeasonFromFirestore().then(season=>{
        $currentSeason = season
    }).catch(err=>{
        throw err
    })
</script>

<body>
    {#if debug}
                <Debug />
    {/if}
    {#if $loggedin && $currentUser}
    <small>
        <div>👤 {$currentUser.email}</div>
        <Logout tiny={true} />
    </small>
        
    {/if}
    <main class='container'>
        {#await promise}
            waiting for season from firestore
        {:then season}
            
            {#if userStoreUpToDate}
                <slot></slot>

                <footer>
                    {#if !$isActive('/')}
                    <div>
                        <Back path='/' msg='Accueil'/>
                    </div>
                    {/if}
                    {#if $loggedin}
                    <div>
                        <Logout />
                    </div>
                    {/if}
                </footer>
                
            {:else} 
                Waiting for user store update
            {/if}
        
        {:catch error}
            <p>Something went wrong: {error.message}</p>
        {/await}
    </main>
</body>

<style>
    footer{
        display:flex;
        flex-wrap: wrap;
        margin-top: 200px;
    }

    footer div{
        flex: 1;
        max-width: 200px;
        margin-right: 10px;
    }
</style>







