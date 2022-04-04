<script>
    import { firebaseApp } from '$utils/firebase' //important, do not remove
    export let context //just to hide warning in console
    import { getAuth, onAuthStateChanged } from "firebase/auth"
    import { currentSeason, currentDay, subscription} from '$utils/stores'
    import { getSeasonFromFirestore } from '$utils/firestore'
    import {currentUser, loggedin, verified, admin} from '$utils/stores'
    import Debug from '$components/Debug.svelte'
   
 
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
    <main class='container'>
        {#await promise}
            waiting for season from firestore
        {:then season}
            
            {#if userStoreUpToDate}
                <slot></slot>
            {:else} 
                Waiting for user store update
            {/if}
        
        {:catch error}
            <p>Something went wrong: {error.message}</p>
        {/await}
    </main>
</body>








