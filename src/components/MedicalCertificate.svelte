<script>
    import Boolean from '$components/Boolean.svelte'
    import {uploadMedicalCertificate} from '$utils/firebase/storage'
    import {currentSeason} from '$utils/stores'
    import { getAuth } from "firebase/auth"
    import { BError } from "berror"
    export let link
    export let timestamp
    export let status
    export let studentId
    
    getAuth().currentUser.getIdToken(true)

    let uploading = false
    const handleChange = (e)=>{
        uploading = true
        const file = e.target.files[0]
        if(!file){
            uploading = false
            throw new BError("No file")
        }
        uploadMedicalCertificate(file, $currentSeason.name, studentId).then(link=>{
            console.log(link)
            uploading = false
            console.log("Done")
        }).catch(err=>{
            uploading = false
            throw new BError("Could not upload certificate", err)
        })
    }
</script>

<details>
    <summary><Boolean value={status} big={true}/>Étape 4 : Transférer un certificat médical</summary>
    {#if uploading}
        <p aria-busy="true">En cours de transfert...</p>
    {/if}
    {#if link}
        <a href={link} target="_new">Voir votre certificat médical</a><br>
        <small>(Téléchargé le {timestamp})</small>
        <br><br>
    {/if}
    {#if status === 'yes'}
        <p style="color:green">Votre certificat médical a été validé par notre équipe !</p>
    {:else if status ==='waiting'}
        <p>Votre certificat a bien été transféré, un email a été envoyé à notre équipe pour qu'elle le valide.</p>
    {/if}
    <br>
    {#if status !== 'yes'}
        <form>
            <label for="upload">Fichier à uploader</label>
            <input id="upload" name="upload" type="file" accept="image/*,.pdf" on:change={handleChange}/>
        </form>
    {/if}
</details>

<style>
    summary{
        font-weight: bold;
    }
</style>