<script>
    let video, canvas

    const startCamera = async()=>{
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        video.srcObject = stream;
    }

    const takePicture = ()=>{

        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');
        console.log(image_data_url);
    }

</script>

<button on:click={startCamera}>Start Camera</button>
<video  width="320" height="240" autoplay bind:this={video}></video>

<button  on:click={takePicture}>Click Photo</button>
<canvas  width="320" height="240" bind:this={canvas}></canvas>
