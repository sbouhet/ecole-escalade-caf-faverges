<script>
    let video, canvas, cameraStarted, pictureTaken
    export let open
    

    const startCamera = async()=>{
        let stream = await navigator.mediaDevices.getUserMedia(
            { 
                audio: false,
                video: {facingMode: 'environment'}
            }
            )
        video.srcObject = stream;
        cameraStarted = true
    }

    const takePicture = ()=>{
        canvas.height= video.videoHeight
        canvas.width= video.videoWidth
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        //let image_data_url = canvas.toDataURL('image/jpeg');
        //console.log(image_data_url);
        pictureTaken = true
    }
</script>

<dialog open>
    <article>
        <div class="container">
            
            <video autoplay bind:this={video} class={!pictureTaken && cameraStarted ? '': 'hidden'}>
                <track default kind="captions" srclang="fr"/>
                Désolé votre navigateur n'est pas compatible.
            </video>
            <canvas  bind:this={canvas} class={pictureTaken?'':'hidden'}></canvas>
            <div class="buttonContainer">
                {#if !cameraStarted}
                    <a href="#" role="button" on:click={startCamera}>Démarrer l'appareil photo</a>
                {:else if !pictureTaken}
                    <a href="#" role="button"  on:click={takePicture}>Prendre une photo</a>
                {:else}
                    <a href="#" role="button" on:click={()=>pictureTaken = false } class="secondary">Réessayer</a>
                    <a href="#" role="button" >Valider</a>
                {/if}
            </div>
            
    
        </div>
        <footer>
            <a href="#" role="button" on:click={()=>open = false} class="outline secondary">Annuler</a>
        </footer>

        
    </article>
</dialog>


<style>
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

    .buttonContainer a{
        margin: 5px;
    }
</style>
