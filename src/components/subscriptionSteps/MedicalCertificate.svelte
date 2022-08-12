<script>
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import {uploadMedicalCertificate} from '$utils/firebase/storage'
    import {currentSeason, error, fatal} from '$utils/stores'
    import {printName} from '$utils/printName'
    import { getAuth } from "firebase/auth"
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getApp } from "firebase/app"
    import { BError } from "berror"
import MobilePicture from '$components/modals/MobilePicture.svelte';
    const functions = getFunctions(getApp())
    const sendEmailAndChangeStatus = httpsCallable(functions, 'sendEmailAndChangeStatus')
    
    export let student, open
    $:id = student.id
    $:status = student.public.seasons[$currentSeason.name].medicalCertificate
    $:link = student.private.medicalCertificateLink
    $:timestamp = student.private.medicalCertificateTimestamp
    let file, openHelpModal, takePicture
    const thisYear = parseInt($currentSeason.name.split("-")[0])
    
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
            const stringArray = file.name.split('.')
            const extension = stringArray[stringArray.length-1]
            const link = await uploadMedicalCertificate(file, $currentSeason.name, id, getAuth().currentUser.uid, `${student.public.lastName.toUpperCase()}_${student.public.firstName}.${extension}`)
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
    <summary role="button" class="outline"><Boolean value={status} big={true}/>Étape 3 : Transférer un certificat médical</summary>

    {#if status === 'yes' || status ==='waiting'}
        <a href={link} target="_new">Voir votre certificat médical (ou attestation sur l'honneur)</a><br>
        <small>(Téléchargé le {timestamp})</small>
        <br><br>
    {/if}
    
    {#if status === 'yes'}
        <p style="color:green">Votre certificat médical (ou attestation sur l'honneur) a été validé par notre équipe !</p>
    {:else if status ==='waiting'}
        <p style="color:green">Votre certificat (ou attestation sur l'honneur) a bien été transféré, un email a été envoyé à notre équipe pour qu'elle le valide.</p>
    {/if}
    <br>
    {#if status !== 'yes'}
        <div>
            Nous avons besoin d'un certificat médical datant de {thisYear} "autorisant la pratique de l'escalade"
            et dans l'idéal avec la notion "en compétition".
            <br><br>
            <div class="card">
                <small>
                    Si vous avez fourni un certificat médical en {thisYear-2} ou {thisYear-1}
                    vous avez également la possibilité de remplir l'attestation sur l'honneur
                    (<a href={$currentSeason.declarationLink} target="_new">téléchargeable ici</a>)
                    stipulant que vous avez répondu "<strong>non</strong>" à toutes les questions du questionnaires QS-Sport
                    (que vous trouverez <a href="https://drive.google.com/file/d/1yf-pZtUTB0Fetw6Q00o4Bz65DLhkewF5/view" target="_new">ici</a> pour les mineurs ;
                    et <a href="https://drive.google.com/file/d/1Aah1EtjWAK4veM4pblyldHtf9H3H8lnV/view" target="_new">ici</a> pour les majeurs).
                    Si vous avez répondu "<strong>oui</strong>" à une ou plusieurs des questions,
                    vous êtes dans l'obligation de fournir un nouveau certificat médical de non contre-indication.
                </small>
            </div>
        </div>
        <br>
        <a href="#" role="button" on:click={()=>takePicture=false} class={takePicture===false?'outline selected':'outline faded'}>
            Transférer votre document au format numérique
        </a>
        <a href="#" role="button" on:click={()=>takePicture=true} class={takePicture?'outline selected':'outline faded'}>
            Prendre une photo avec votre téléphone portable
        </a>
        <br><br>
        {#if takePicture}
            <MobilePicture />
        {:else if takePicture === false}
            <form>
                <label for="upload">Transférer votre certificat médical (ou attestation sur l'honneur) au format numérique :</label>
                <input id="upload" name="upload" type="file" accept="image/*,.pdf" on:change={handleChange}/>
                <button disabled={!file} aria-busy={uploading} on:click|preventDefault={submit} >
                    {#if uploading}
                        merci de patienter...
                    {:else}
                        Envoyer le document
                    {/if}
                </button>
            </form>
            ℹ <a href="#" on:click={()=>openHelpModal=true}>J'ai un certificat papier comment faire pour le numériser ?</a>
        {:else}
        {/if}
        {#if openHelpModal}
            <dialog open>
                <article>
                    Il existe plusieurs options pour numériser votre document :
                    <br><br>
                    <ul>
                        <li>Utiliser un scanner (la plupart des imprimantes ont un scanner intégré)</li>
                        <br>
                        <li>Utiliser votre téléphone 
                            <ul>
                                <li>Vous avez l'application Google Drive ?
                                    <a target="_new" href="https://support.google.com/drive/answer/3145835?hl=fr&co=GENIE.Platform%3DAndroid&oco=0">
                                        Cliquez ici
                                    </a>
                                </li>
                                <li>Vous avez un Iphone ?
                                    <a target="_new" href="https://support.apple.com/fr-ca/HT210336">
                                    Cliquez ici
                                    </a>
                                </li>
                                <li>Vous avez un téléphone Android ? (Samsung, Xiaomi, Honor, OnePlus, Oppo, Sony, etc.)
                                    <a target="_new" href="https://play.google.com/store/apps/details?id=com.adobe.scan.android&referrer=utm_source%3DAdobe.com%2520DC&utm_medium=Web&utm_term=Scan&utm_content=Get%2520App&utm_campaign=FY18">
                                        Cliquez ici
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <footer>
                        <a href="#" role="button" on:click={()=>openHelpModal=false}>C'est compris !</a>
                    </footer>
                </article>
            </dialog>
        {/if}
    {/if}
</details>

<style>
    button{
        max-width: 250px;
    }
    .card{
        background-color: rgba(0, 0, 0, 0.05);
        border-left: 6px solid #1F95C1;
        padding: 20px;
    }

    li li{
        list-style:circle;
    }

    .faded{
        opacity: 0.8;
    }

    .selected{
        font-weight:600;
    }

</style>