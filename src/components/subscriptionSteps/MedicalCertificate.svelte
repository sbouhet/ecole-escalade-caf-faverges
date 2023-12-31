<script>
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import {currentSeason} from '$utils/stores'
    import {submitCertificate} from '$utils/submitCertificate'
    import { getAuth } from "firebase/auth"
    import PaperCertificate from '$components/htmlElements/PaperCertificate.svelte';
    export let student, open, error
 
    $:status = student.public.seasons[$currentSeason.name].medicalCertificate
    $:link = student.private.medicalCertificateLink
    $:timestamp = student.private.medicalCertificateTimestamp
    let doc, paper
    const thisYear = parseInt($currentSeason.name.split("-")[0])
    
    let uploading = false

    //When user choses a certificate, update file variable
    const handleChange = (e)=>{
        doc = e.target.files[0]
    }

    const submit = async ()=>{
        uploading = true
        const file = {doc, type: 'doc'}
        try {
            const response = await submitCertificate(file, $currentSeason.name, student, getAuth().currentUser.uid)
            if (response.statusCode === 200){
                console.log(response)
            }else{
                throw response.error
            }
            uploading = false
        } catch (e) {
            uploading = false
            error = e
        }
    }

</script>

<details open={open}>
    <summary role="button" class="outline"><Boolean value={status} big={true}/>Étape 3 : Transférer un certificat médical</summary>

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
        Votre document (certificat médical ou attestation) est sous quel format ?<br><br>
        <a href="#" role="button" on:click={()=>paper=false} class={paper===false?'outline selected':'outline faded'}>
            Numérique
        </a>
        <a href="#" role="button" on:click={()=>paper=true} class={paper?'outline selected':'outline faded'}>
            Papier
        </a>
        <br><br>
        {#if paper}
            <PaperCertificate bind:open={paper} {student}/>
        {:else if paper === false}
            <form>
                <label for="upload">Transférer votre certificat médical (ou attestation sur l'honneur) au format numérique :</label>
                <input id="upload" name="upload" type="file" accept="image/*,.pdf" on:change={handleChange}/>
                <button disabled={!doc || uploading} aria-busy={uploading} on:click|preventDefault={submit} >
                    {#if uploading}
                        Merci de patienter...
                    {:else}
                        Envoyer le document
                    {/if}
                </button>
            </form>
            {#if error}
                <div style="color:red">
                    <strong>Erreur :</strong> Impossible de transférer le document.<br>
                    <small>{error}</small>
                </div>
            {/if}
        {:else}
            &nbsp;
        {/if}
    {/if}
    <br><br>
    
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
    .faded{
        opacity: 0.8;
    }
    .selected{
        font-weight:600;
    }
    .selected, .faded{
        margin: 5px;
    }
</style>