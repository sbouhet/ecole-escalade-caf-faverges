<script>
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import {uploadMedicalCertificate} from '$utils/firebase/storage'
    import {currentSeason, error, fatal} from '$utils/stores'
    import {printName} from '$utils/printName'
    import { getAuth } from "firebase/auth"
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getApp } from "firebase/app"
    import { BError } from "berror"
    const functions = getFunctions(getApp())
    const sendEmailAndChangeStatus = httpsCallable(functions, 'sendEmailAndChangeStatus')
    
    export let student, open
    $:id = student.id
    $:status = student.public.seasons[$currentSeason.name].medicalCertificate
    $:link = student.private.medicalCertificateLink
    $:timestamp = student.private.medicalCertificateTimestamp
    let file
    
    let uploading = false

    //When user choses a certificate, update file variable
    const handleChange = (e)=>{
        file = e.target.files[0]
    }

    //On submit, frontend function + backend functions
    const submit = async() => {
        try {
            if(!file) return
            uploading = true
            const link = await uploadMedicalCertificate(file, $currentSeason.name, id, getAuth().currentUser.uid)
            console.log(link)
            const response = await sendEmailAndChangeStatus({seasonName:$currentSeason.name, id, name:printName(student.public)})
            console.log(response)
            if(response.data.statusCode!==200) throw new Error(response.data.message)
            console.log("Medical certificate uploaded successfully")
            uploading = false           
        } catch (err) {
            uploading = false
            const e = new BError("Could not upload certificate", err)
            e.log()
            $error = e
            $fatal = true
        }
    } 
    
</script>

<details open={open}>
    <summary role="button" class="outline"><Boolean value={status} big={true}/>Étape 4 : Transférer un certificat médical</summary>

    {#if link}
        <a href={link} target="_new">Voir votre certificat médical</a><br>
        <small>(Téléchargé le {timestamp})</small>
        <br><br>
    {/if}
    
    {#if status === 'yes'}
        <p style="color:green">Votre certificat médical a été validé par notre équipe !</p>
    {:else if status ==='waiting'}
        <p style="color:green">Votre certificat a bien été transféré, un email a été envoyé à notre équipe pour qu'elle le valide.</p>
    {/if}
    <br>
    {#if status !== 'yes'}
        <form>
            <label for="upload">Votre certificat médial :</label>
            <input id="upload" name="upload" type="file" accept="image/*,.pdf" on:change={handleChange}/>
            <button disabled={!file} aria-busy={uploading} on:click|preventDefault={submit} >
                {#if uploading}
                    merci de patienter...
                {:else}
                    Envoyer le certificat
                {/if}
            </button>
        </form>
    {/if}
</details>

<style>
    button{
        max-width: 250px;
    }
</style>