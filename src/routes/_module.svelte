<script>
    import { firebaseApp } from '$utils/firebase/firebase' //important, do not remove
    export let context //just to hide warning in console
    import { getAuth, onAuthStateChanged } from "firebase/auth"
    import { getSeason } from '$firestore/season'
    import {currentDay, currentSeason, loggedin, subscription, admin} from '$utils/stores'
    import Debug from '$components/Debug.svelte'
    import Back from '$components/Back.svelte'
    import Logout from '$components/Logout.svelte'
    import {isActive} from '@roxi/routify'
    import { seasons } from '$utils/seasons'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import { subscriptionReset } from '$utils/subscriptionReset'
    import { BError } from "berror"

    $admin = false
    let verified = false
    let selectedSeason = 'current'

    $:if ($currentSeason) {
        //reset
        console.log("Resetting because season changed")
        $subscription = subscriptionReset($currentSeason)
        $currentDay = $currentSeason.days[0]
    }
 
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
            console.log(res.claims)
          $admin = !!res.claims.admin
          userStoreUpToDate = true
        })
      }else{
        $loggedin = false
        $admin = false
        verified = false
        userStoreUpToDate = true
      }
      
	  })

    $: promise = getSeason(selectedSeason).then(season=>{
        $currentSeason = season
    }).catch(err=>{
        throw new BError("Could not get season", err).log()
    })
</script>

<body>
    {#if debug}
                <Debug />
    {/if}
    
    <div class="season">
        <small>
            {#if $admin}
                <select id="season" name="season" bind:value={selectedSeason}>
                    <option value={'last'}>{seasons().last}</option>  
                    <option value={'current'}>{seasons().current}</option>  
                    <option value={'next'}>{seasons().next}</option>  
                </select>
            {:else if $currentSeason}
                {$currentSeason.name}&nbsp;
            {/if}
        </small>
    </div>
    <small>
        {#if $loggedin && getAuth().currentUser}
            <div>
                <span>👤 </span>
                {getAuth().currentUser.email}
                {#if $admin}
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