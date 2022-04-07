<script>
    import { firebaseApp } from '$utils/firebase' //important, do not remove
    export let context //just to hide warning in console
    import { getAuth, onAuthStateChanged } from "firebase/auth"
    import { getSeasonFromFirestore } from '$utils/firestore'
    import {currentSeason, loggedin, subscription} from '$utils/stores'
    import Debug from '$components/Debug.svelte'
    import Back from '$components/Back.svelte'
    import Logout from '$components/Logout.svelte'
    import {isActive} from '@roxi/routify'
    import { doc, onSnapshot } from "firebase/firestore"
    import { seasons } from '$utils/seasons'
    import { db } from '$utils/firebase'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import { subscriptionReset } from '$utils/subscriptionReset'

    let admin = false
    let verified = false
    let selectedSeason = 'current'

    $:if ($currentSeason) {
        //console.log($currentSeason)
        $subscription = subscriptionReset($currentSeason.name)
    }

    //$:console.log($subscription)
   
 
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

    $: promise = getSeasonFromFirestore(selectedSeason).then(season=>{
        $currentSeason = season
    }).catch(err=>{
        throw err
    })
</script>

<body>
    {#if debug}
                <Debug />
    {/if}
    <div class="season">
        <small>
            <select id="season" name="season" disabled={!admin} bind:value={selectedSeason}>
                <option value={'last'}>{seasons().last}</option>  
                <option value={'current'}>{seasons().current}</option>  
                <option value={'next'}>{seasons().next}</option>  
            </select>
        </small>
    </div>
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
            Merci de patienter...
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
                <ErrorMessage {error} />
        {/await}
    </main>
</body>

<style>
    .season{
        position:absolute;
        right: 0;
    }
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







