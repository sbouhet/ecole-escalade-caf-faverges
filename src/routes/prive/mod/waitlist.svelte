<script>
import { _getDoc } from "$utils/firebase/firestore/basics"
import { currentSeason } from '$utils/stores'
import { httpsCallable, connectFunctionsEmulator } from "firebase/functions"
import { functions } from '$utils/firebase/firebase' 
connectFunctionsEmulator(functions, "localhost", 5001)

const sendEmailToPeople = httpsCallable(functions, 'sendEmailToPeople')

let waitlist, details, done, count
let days = []

const run = async()=>{
    const ref = await _getDoc("waitlist", $currentSeason.name)
    waitlist = ref.data()
    days = Object.keys(waitlist).sort()

}

run()
let textToCopy

const copyToClipboard = (day)=>{
    count = 0
    done = false
    if(day){
        textToCopy = waitlist[day].join(",")
        count = waitlist[day].length
    }else{
        let strings = []
        count
        for (const day of days) {
            strings.push(waitlist[day].join(","))
            count += waitlist[day].length
        }
        textToCopy = strings.join(",")
    }
    navigator.clipboard.writeText(textToCopy)
    done = true
}

const test = async()=>{
    console.log("start")
    const result = await sendEmailToPeople({emails:["friarobaz@gmail.com", "julesmarchand74@gmail.com"], subject:"test", htmlContent:"Salut les copains <b>GRAS</b>"})
    console.log(result)
}
</script>


<h1>Listes d'attente</h1>
<a href="" on:click={()=>copyToClipboard()}>Copier toutes les adresses mails (tous crénaux confondus)</a>
<br><br>
<input type="text" bind:value={textToCopy} disabled>

{#if done}
    <div style="color:green">✅ {count} adresses copiées dans le presse-papier.</div>
{:else}
    <div style="visibility: hidden;">lol</div>
{/if}
<br>

{#each days as day}
    <hgroup>
        <h4 on:click={()=>copyToClipboard(day)}>{day} 📋</h4> 
        <h5>{waitlist[day].length} adresses</h5>
    </hgroup>
    
    {#if details}
        {#each waitlist[day] as email, i}
            {i+1})  {email}<br>
        {/each}
    {/if}
    <hr>
{/each}

<input type="checkbox" role="switch" bind:checked={details}> Détails

<button on:click={test}>TEST</button>
