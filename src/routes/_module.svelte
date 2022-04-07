<script>
    import { firebaseApp } from '$utils/firebase' //important, do not remove
    export let context //just to hide warning in console
    import { getAuth, onAuthStateChanged } from "firebase/auth"
    import { getSeasonFromFirestore } from '$utils/firestore'
    import {currentSeason, loggedin} from '$utils/stores'
    import Debug from '$components/Debug.svelte'
    import Back from '$components/Back.svelte'
    import Logout from '$components/Logout.svelte'
    import {isActive} from '@roxi/routify'
    import { doc, onSnapshot } from "firebase/firestore"
    import { seasons } from '$utils/seasons'
    import { db } from '$utils/firebase'

    let verified = false
    let admin = false
   
 
    const allowDebug = true
    let debug = false
    document.addEventListener('keydown', e=>{
        if (e.key==="Dead" && allowDebug) debug = !debug}
    )
    
    let userStoreUpToDate = false

    onAuthStateChanged(getAuth(), (usr)=>{
        userStoreUpToDate = false
        //console.log(getAuth().currentUser)
      if(usr){
        $loggedin = true
        verified = usr.emailVerified
        usr.getIdTokenResult().then(res => {
            //console.log(res.claims.admin)
          admin = !!res.claims.admin
          userStoreUpToDate = true
        })
      }else{
        $loggedin = false
        admin = false
        verified = false
        userStoreUpToDate = true
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
    <small>
        {#if $loggedin && getAuth().currentUser}
            <div>
                <span>👤 </span>
                {getAuth().currentUser.email}
                {#if admin}
                    (admin)
                {/if}
            </div>
            <Logout tiny={true} />
        {:else}
            <a href="/prive/mon-compte">Se connecter</a>
        {/if}
    </small>
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

                   <!--  {#if getAuth().currentUser!==null}
                        <div>
                            <Logout />
                        </div>
                    {/if} -->

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
        margin-top: 100px;
    }

    footer div{
        flex: 1;
        max-width: 200px;
        margin-right: 10px;
    }

    span{
        margin: 5px;
    }
</style>







