<script>
    import { submitCertificate } from "$utils/submitCertificate"
    import {currentSeason} from '$utils/stores'
    import { getAuth } from "firebase/auth";
    export let student, url, open, uploading
    let video, canvas, cameraStarted, pictureTaken, error, errorType

    const startCamera = async()=>{
        try {
            let stream = await navigator.mediaDevices.getUserMedia(
                    { 
                        audio: false,
                        video: {facingMode: 'environment'}
                    }
                )
            video.srcObject = stream;
            cameraStarted = true
        } catch (e) {
            errorType = 'camera'
            error = e
        }
    }

    const takePicture = ()=>{
        canvas.height= video.videoHeight
        canvas.width= video.videoWidth
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        url = canvas.toDataURL('image/jpeg');
        pictureTaken = true
    }

    $:if(open) startCamera()

    const submit = async ()=>{
        try {
            if(uploading) return
            uploading = true
            const file = {url, type: 'url'}
            const response = await submitCertificate(file, $currentSeason.name, student, getAuth().currentUser.uid)
            if (response.statusCode === 200){
                console.log(response)
            }else{
                throw response.error
            }
            uploading = false
            open = false
        } catch (e) {
            uploading = false
            errorType = 'upload'
            error = e
        }
    }
</script>

<dialog {open}>
    <article>
        {#if !error}
            <div class="container">
                
                <!-- Video stream -->
                <video autoplay bind:this={video} class={!pictureTaken && cameraStarted ? '': 'hidden'} on:click={takePicture}>
                    <track default kind="captions" srclang="fr"/>
                    Désolé votre navigateur n'est pas compatible.
                </video>

            <!--  Picture taken -->
                <canvas  bind:this={canvas} class={pictureTaken?'':'hidden'}></canvas>

            <!--  Buttons -->
                <div class="buttonContainer">
                    {#if !cameraStarted}
                        <div aria-busy=true>Recherche de la camera, merci de patienter...</div>
                        
                    {:else if !pictureTaken}
                        <button on:click={takePicture}>Prendre une photo</button>
                    {:else}
                        {#if uploading}
                            <button disabled aria-busy={true}>Merci de patienter...</button>
                        {:else}
                            <button on:click={()=>pictureTaken = false } class="secondary">Réessayer</button>
                            <button on:click={submit}>Valider</button>
                        {/if}
                    {/if}
                </div>
            </div>
        {:else}
            <div style="color:red">
                {#if errorType === 'camera'}
                    <strong>Aucune camera trouvée</strong>
                    <br>
                    Vérifiez que votre navigateur ne bloque pas votre caméra.
                {:else if errorType === 'upload'}
                    <strong>Impossible de transférer la photo</strong>
                {/if}
                    <br><br>
                    Erreur : <small>{error}</small>
            </div>
        {/if}
       
        <footer>
            <a href="#" role="button" on:click={()=>{if(uploading) return;pictureTaken = false; cameraStarted=false; open = false; }} class="outline secondary">Annuler</a>
        </footer>
    </article>
</dialog>       

<style>
    button{
        max-width: 250px;
    }
    video, canvas{
        width: 100%;
        max-width: 600px ;
        margin-bottom: 10px;
    }

    .hidden{
        display: none;
    }
    
    .container{
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    
    .buttonContainer{
        display: flex;
        justify-content: center;
    }

    .buttonContainer button{
        margin: 5px;
    }
</style>