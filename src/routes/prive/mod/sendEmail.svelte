<script>
    import { _addDoc, _deleteDoc, _updateDoc, _getDoc, _query } from "$utils/firebase/firestore/basics"
    import {currentSeason} from '$utils/stores'
    import { db } from "$utils/firebase/firebase"
    import { collection, query, where, onSnapshot } from "firebase/firestore"
    import { httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { functions } from '$utils/firebase/firebase' 
    import { getDayUrl } from "$utils/days"
    import Tooltip from '$components/htmlElements/Tooltip.svelte'
    connectFunctionsEmulator(functions, "localhost", 5001)
    const sendEmailToPeople = httpsCallable(functions, 'sendEmailToPeople')

    let subject, htmlContent, selectedTemplateIndex, name, id, emailString, showWaitlist, showMoreEmails
    let templates= []
    let allEmails = []
    let emails = []
    let lists = []
    $:if(lists.length>0){
        allEmails = mergeEmails()
    }
    $:if(showMoreEmails === false) emailString = ''
    $:if(showWaitlist === false){
        for (const waitlist of lists.filter(x=>x.type=="waitlist")) {
            waitlist.selected = false
        }
        lists=lists
    }

    const mergeEmails = ()=>{
        const allEmails = []
        const selected = lists.filter(x=>x.selected).map(x=>x.emails)
        for (const list of selected) {
            allEmails.push(...list)
        }
        if(emailString && showMoreEmails){
            const manualEmails = emailString.split(",")
            allEmails.push(...manualEmails)
        }
        const uniqueEmails = [...new Set(allEmails)];
        return uniqueEmails
    }

    const addWaitlistsTolists = async()=>{
        try {
            const waitlistRef = await _getDoc("waitlist", $currentSeason.name)
            const waitlist = waitlistRef.data()
            const days = Object.keys(waitlist)
            for (const day of days) {
                lists.push({selected:false, name: day, emails: waitlist[day], type:"waitlist"})
            }
        } catch (error) {
            console.log("Could not get waitlist")
            alert(error)
        }
    }

    const addModsToLists = async()=>{
        try {
            const refs = await _query("users", "mod", "==", true)
            const emails = refs.map(x=>x.data().email)
            for (const email of emails) {
                lists.push({selected:true, name:email, emails:[email], type:"mod"})
            }
        } catch (error) {
            console.log("Could not get mods")
            alert(error)
        }
    }

    const getEmailsFromStudent = async (id)=>{
        const ref = await _getDoc("students", id, "privateCol", "privateDoc")
        const doc = ref.data()
        const emails = []
        if(doc.email) emails.push(doc.email)
        if(doc.parents && doc.parents.length>0){
            for (const parent of doc.parents) {
                if(parent.email)emails.push(parent.email)
            }
        }
        return emails
    }

    const addDayEmailsToLists = async()=>{
        try {
            const studentRefs = await _query("students", `seasons.${$currentSeason.name}.day`, ">", "")
            const students = studentRefs.map(x=>x.data())
            const days = $currentSeason.days
            for (const day of days) {
                const dayUrl = getDayUrl(day)
                const refs = await _query("students", `seasons.${$currentSeason.name}.day`, "==", dayUrl)
                const ids = refs.map(x=>x.id)
                let emails = []
                for (const id of ids) {
                    const studentEmails = await getEmailsFromStudent(id)
                    for (const email of studentEmails) {
                        emails.push(email)
                    }
                }
                lists.push({selected: false, name:dayUrl, emails, type:"group"})
            }
        } catch (error) {
            console.log("Could not get emails from groups")
            alert(error)
        }
    }

    const getLists = async() => {
        lists = []
        await addWaitlistsTolists()
        await addDayEmailsToLists()
        await addModsToLists()
        lists=lists
    }

    getLists()

    const updateContent = (index)=>{
        selectedTemplateIndex = index
        htmlContent = templates[index].data().htmlContent
        subject = templates[index].data().subject
        name = templates[index].data().name
        id = templates[index].id
    }

    //Listen to template changes
    const q = query(collection(db, "emails", "templatesDoc", "templatesCol"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        templates = [];
        querySnapshot.forEach((doc) => {
            templates.push(doc);
        })
    })

    const saveAsNewTemplate = async ()=>{
        try {
            if(!subject) throw "Il manque l'object"
            if(!htmlContent) throw "Il manque le message"

            const name = window.prompt("Donnez un nom à ce modèle")
            if(!name) throw "Il manque le nom"
            console.log("saving")
            const templateId = await _addDoc({subject,htmlContent, name}, "emails", "templatesDoc", "templatesCol")
            console.log(`Modèle créé avec l'id ${templateId}`)
            
        } catch (error) {
            alert(error)
        }
    }

    const updateTemplate = async()=>{
        try {
            if(!subject) throw "Il manque l'object"
            if(!htmlContent) throw "Il manque le message"
            const result = window.confirm("Êtes vous sur de vouloir modifier le modèle "+name)
            if(!result)return
            console.log("updating")
            await _updateDoc({subject, htmlContent}, "emails", "templatesDoc", "templatesCol", id)
            console.log("done")
        } catch (error) {
            alert(error)
        }
    }

    const deleteDoc = async()=>{
        try {
            if(!id) throw "Aucun modèle selectionné"
            const result = window.confirm("Êtes vous sur de vouloir supprimer le modèle "+name)
            if(!result)return
            await _deleteDoc("emails", "templatesDoc", "templatesCol", id)
            console.log("done")
        } catch (error) {
            alert(error)
        }
    }

    const sendEmail = async()=>{
        try {
            if(!subject) throw "Il manque l'object"
            if(!htmlContent) throw "Il manque le message"
            if(!emails || emails.length<=0) throw "Il manque les adresses email"
    
            const result = window.confirm(`Êtes vous sur de vouloir envoyer cet email à ${emails.length} adresses ?`)
            if(!result)return
    
            const result2 = await sendEmailToPeople({emails, subject, htmlContent})
            console.log(result2)
        } catch (error) {
            alert(error)
        }
    }
</script>

<h1>Envoyer un email</h1>
{#if lists && lists.length>0}
<section>
    <h4>Destinataires</h4>
    
        Moderateurs:
        <br><br>
        <div class="buttonGrid">
            {#each lists as list, i}
                {#if list.type == "mod"}
                    <a href="" role="button" class={list.selected?'contrast':'contrast outline'} on:click={()=>lists[i].selected = !lists[i].selected}>{list.name}</a>
                {/if}
            {/each}
        </div>
        <br><br>
        Groupes:<br><br>
        <div class="buttonGrid">
            {#each lists as list, i}
                {#if list.type == "group"}
                    <a href="" role="button" class={list.selected?'selected':'outline'} on:click={()=>lists[i].selected = !lists[i].selected}>{list.name}</a>
                {/if}
            {/each}
        </div>
        <br><br>
        Listes d'attente:
        <input type="checkbox" role="switch" bind:checked={showWaitlist}>
        {#if showWaitlist}
            <br><br>
            <div class="buttonGrid">
                {#each lists as list, i}
                    {#if list.type == "waitlist"}
                        <a href="" role="button" class={list.selected?'secondary':'secondary outline'} on:click={()=>lists[i].selected = !lists[i].selected}>{list.name}</a>
                    {/if}
                {/each}
            </div>
        {/if}
        
      
        <br><br>
        Ajouter des adresses emails:
        <input type="checkbox" role="switch" bind:checked={showMoreEmails}>
        {#if showMoreEmails}
            <br><br>
            Entrez des emails séparées par des virgules :
            <input type="text" bind:value={emailString}>
            {#if emailString}
                <ul>
                    {#each emailString.split(",") as email}
                        <li>{email}</li>
                    {/each}
                </ul>
            {/if}
        {/if}
        <br><br>
        <Tooltip list={allEmails}>
            <strong>Total : {allEmails.length} adresses email selectionnées</strong>
            <small style="color:grey">(detail en bas de page)</small>
        </Tooltip>
    
</section>
<section>
    <h4>Contenu</h4>
    Modèles :
    {#each templates as template, i}
        <span class="button">
            <a href="" role="button" class={selectedTemplateIndex===i?'':'outline'} on:click={()=>updateContent(i)}>{template.data().name}</a>
        </span>
    {/each}
    <br><br>
    <form>
        <label for="subject">Objet</label>
        <input type="text" id="subject" bind:value={subject} required>
    
        <label for="htmlContent">Message</label>
        <textarea type="text" id="htmlContent" name="htmlContent" rows="4" required bind:value={htmlContent}></textarea>
        
        <a href="" role="button" class="del" on:click={deleteDoc}>Supprimer</a>
        <a href="" role="button" class="secondary" on:click={updateTemplate}>Enregistrer le modèle</a>
        <a href="" role="button" class="secondary" on:click={saveAsNewTemplate}>Enregistrer en tant que nouveau modèle</a>
        <a href="" role="button" on:click={()=>sendEmail()}>Envoyer</a>
        <br><br>
        <div>Appercu :</div><br>
        {#if subject}
            <strong>{subject}</strong>
        {/if}
        <div class="preview">
            {#if htmlContent}
                {@html htmlContent}
            {/if}
        </div>
    </form>
    <ul>
        {#each allEmails as email}
            <li>{email}</li>
        {/each}
    </ul>
</section>
{:else}
        Merci de patienter...
 {/if}

<style>
    .preview{
        border: 1px solid grey;
        border-radius: 5px;
        width: 100%;
        min-height: 200px;
        margin-bottom: 20px;
        margin-top: 10px;
        padding: 20px;
    }

    .del{
        background-color: rgb(224, 39, 39);
        border: 0;
    }

    .button{
        margin: 10px;
    }

    textarea{
        font-size: medium;
    }

    .buttonGrid{
        display: inline-grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-row-gap: 10px;
        grid-column-gap: 10px;
    }

    li{
        list-style: none;
        font-size: small;
    }
</style>

