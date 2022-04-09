<script>
    export let context
    
    import {params} from '@roxi/routify'
    import { getStudent } from '$utils/firestore'
    import { printName } from '$utils/printName'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import { currentSeason } from '$utils/stores'
    import { translateRole } from '$utils/translateRole'
    import Boolean from '$components/Boolean.svelte'
    import { deleteMedicalCertificate, uploadMedicalCertificate } from '$utils/storage'
    let urlId = $params.id
    const student = getStudent(urlId)
    let uploading = false
    let medicalCertificateLink = null
    $:if(student.private && student.private.medicalCertificateLink){
        console.log(student.private)
        medicalCertificateLink = student.private.medicalCertificateLink
    } 
    const handleChange = (e)=>{
        uploading = true
        const file = e.target.files[0]
        if(!file)throw 'no file' 
        uploadMedicalCertificate(file, $currentSeason.name, urlId).then(link=>{
            //medicalCertificateLink = link
            const student = getStudent(urlId)
            uploading = false
            console.log("Done")
        }).catch(err=>{
            uploading = false
            throw err
        })
    }
</script>

{#await student}
    Recherche de l'Inscription, merci de patienter...
{:then student}
    <article>
        <hgroup>
            <h1>{printName(student.public)}</h1>
            <h4>{student.public.seasons[$currentSeason.name].status}</h4>
        </hgroup>
        
        <details>
            <summary><Boolean value={'yes'} big={true}/>Étape 1 : Créer un compte sur le site de l'école d'escalade</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
        <details>
            <summary><Boolean value={student.public.seasons[$currentSeason.name].payment} big={true}/>Étape 2 : Éffectuer le paiment en ligne pour les cours.</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
        <details>
            <summary><Boolean value={student.public.seasons[$currentSeason.name].licence} big={true}/>Étape 3 : Prendre une licence au CAF de Faverges</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
        <details>
            <summary><Boolean value={student.public.seasons[$currentSeason.name].medicalCertificate} big={true}/>Étape 4 : Transférer un certificat médical</summary>
            {#if uploading}
                <p>UPLOADING...</p>
            {/if}
            {#if student.private.medicalCertificateLink}
                <a href={student.private.medicalCertificateLink} target="_new">Voir votre certificat médical</a>
            {/if}
            <form>
                <label for="upload">Fichier à uploader</label>
                <input id="upload" name="upload" type="file" accept="image/*,.pdf" on:change={handleChange}/>
            </form>
        </details>
    </article>
{:catch error}
    <ErrorMessage {error} />
{/await}

<slot></slot>

<style>
    summary{
        font-weight: bold;
    }
   
</style>