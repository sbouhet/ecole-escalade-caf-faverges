<script>
    import { firebaseApp } from '$utils/firebase/firebase' //important, do not remove
    export let context //just to hide warning in console
    import { getAuth, onAuthStateChanged } from "firebase/auth"
    import { getSeason } from '$firestore/season'
    import {currentDay, currentSeason, loggedin, subscription, admin, error, fatal, students} from '$utils/stores'
    import Back from '$components/htmlElements/Back.svelte'
    import Logout from '$components/htmlElements/Logout.svelte'
    import {isActive} from '@roxi/routify'
    import { seasons } from '$utils/seasons'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import { subscriptionReset } from '$utils/subscriptionReset'
    import { BError } from "berror"
    import ErrorModal from '$components/modals/ErrorModal.svelte'
    import { collection, query, where, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { printName } from '$utils/printName'
    import { _getDoc } from '$firestore/basics'

    

    $admin = false
    let verified = false
    let selectedSeason = 'current'
    let notifications = []

    //$:console.log($students)
    $:console.log($subscription)

    $:if ($currentSeason) {
        //Reset subscription because season has changed
        $subscription = subscriptionReset($currentSeason)
        $currentDay = $currentSeason.days[0]

        //Get students from selected season
        const q = query(collection(db, "students"), where(`seasons.${$currentSeason.name}.status`, ">", ""))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if(snapshot.docChanges().length===1) pushNotification(snapshot.docChanges()[0])
            
            /* snapshot.docChanges().forEach((change) => {
                pushNotification(change)
            })//end of change function */

        const studentsArray = []
        snapshot.forEach((doc) => {
            studentsArray.push(doc)
        })
        $students = studentsArray
        },(err) => {
            console.log(err)
            $error = err
            $fatal=true
        })
    }
    
    let userStoreUpToDate = false

    onAuthStateChanged(getAuth(), (usr)=>{
        userStoreUpToDate = false
        //console.log(getAuth().currentUser)
      if(usr){
        $loggedin = true
        verified = usr.emailVerified
        usr.getIdTokenResult().then(res => {
            console.log(res.claims)
          $admin = !!res.claims.admin || !!res.claims.mod
        
          //TEST
          //$admin = true
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
        const e = new BError("routes/_module.svelte => Could not get season", err)
        e.log()
        throw e
        $error = e
        $fatal = true
    })
    const pushNotification = async (change)=>{
        const student = change.doc.data()
        if(change.type==="modified") return
        const text = `Student ${change.type} : ${printName(student)}`
        console.log(text)
        notifications = [...notifications, text]
    }
   

    const removeNotification=(e)=>{
        notifications.splice(e.target.id,1)
        notifications = notifications
    }
</script>

<body>
    {#if $admin}    
        <div class="notifications">
                {#each notifications as notif, index}
                    <div class="notif" on:click={removeNotification} id={index}>{notif}</div>
                {/each}
        </div>
    {/if}
    {#if !$error}
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
                <p aria-busy="true">
                    Merci de patienter...
                </p>
            {:then season}
                {#if userStoreUpToDate}
                        <slot></slot>
                    <footer>
                        {#if !$isActive('/')}
                        <div>
                            <Back path='/' msg='Accueil'/>
                        </div>
                        {/if}
                    </footer>
                {:else} 
                    <p aria-busy="true">Waiting for user store update</p>
                {/if}
            {:catch err}
                <ErrorMessage error="Cette saison n'existe pas encore."/>
            {/await}
        </main>
    {:else}
        <ErrorModal />
       <ErrorMessage error={$error}/>
    {/if}
</body>

<style>
    @keyframes example {
        0% {
            right:-300px;
        }
        100%{
            right:0px;
        }
    }
    @keyframes test {
        0% {
            background-position: 0% 50%;
            border-radius: 30px;
        }
        50%{
            background-position: 100% 50%;
            border-radius: 0px;
        }
        100%{
            background-position: 0% 50%;
            border-radius: 30px;
        }
    }

    .notifications{
        font-size: smaller;
        text-align: right;
        position:absolute;
        right: 0;
        top: 60px;
    }
    .notif{
        position: relative;
        animation: example 0.5s, test 4s ease infinite;
        padding: 15px;
        margin: 5px;
        color:white;
        background: rgb(237, 236, 237);
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        border-radius: 30px;
    }
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