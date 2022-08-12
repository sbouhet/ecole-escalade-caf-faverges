<script>
    let video, canvas

    const startCamera = async()=>{
        let stream = await navigator.mediaDevices.getUserMedia(
            { 
                audio: false,
                video: {facingMode: 'environment'}
            }
            )
        video.srcObject = stream;
    }

    const takePicture = ()=>{

        canvas.height= video.videoHeight
        canvas.width= video.videoWidth
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');
        //console.log(image_data_url);
        console.log(video.videoWidth, video.videoHeight);
        
    }

</script>

<a href="#" role="button" on:click={startCamera}>Start Camera</a>
<a href="#" role="button"  on:click={takePicture}>Click Photo</a>
<br>
<video autoplay bind:this={video}>
    <track default kind="captions" srclang="fr"/>
    Désolé votre navigateur n'est pas compatible.
</video>
<canvas  bind:this={canvas}></canvas>

<style>
    video, canvas{
        width: 50%;
        max-width: 400px ;
    }
    
</style>
