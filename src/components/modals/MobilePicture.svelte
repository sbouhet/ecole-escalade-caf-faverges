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

        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');
        console.log(image_data_url);
    }

</script>

<a href="#" role="button" on:click={startCamera}>Start Camera</a>
<a href="#" role="button"  on:click={takePicture}>Click Photo</a>
<br>
<video  autoplay bind:this={video}></video>
<canvas  bind:this={canvas}></canvas>

<style>
    video{
        max-width: 400px;
    }
    canvas{
        max-width: 300px;
    }
</style>
