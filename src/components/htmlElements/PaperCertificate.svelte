<script>
    import MobilePicture from "$components/modals/MobilePicture.svelte";
    let pictureModal, scan
    export let open
    export let student
</script>

Dans ce cas vous avez deux possibilités :<br><br>

<a href="#" role="button" on:click={()=>scan=false} class={scan===false?'outline selected':'outline faded'}>
    Prendre une photo du document
</a>
<a href="#" role="button" on:click={()=>scan=true} class={scan?'outline selected':'outline faded'}>
    Numériser votre document
</a>
<br><br>
<strong>Attention ! </strong> Pour être accepté, votre document devra être parfaitement lisible.
Les documents tronqués, trop sombres, ou flous ne seront pas validés par notre équipe. 
<br><br>

{#if scan}
    Il existe plusieurs moyens de numériser votre document :
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
                <li>Vous avez un téléphone Android ? <small>(Samsung, Xiaomi, Honor, OnePlus, Oppo, Sony, etc.)</small> 
                    <a target="_new" href="https://play.google.com/store/apps/details?id=com.adobe.scan.android&referrer=utm_source%3DAdobe.com%2520DC&utm_medium=Web&utm_term=Scan&utm_content=Get%2520App&utm_campaign=FY18">
                        Cliquez ici
                    </a>
                </li>
            </ul>
        </li>
    </ul>
    Une fois votre document numérisé vous pouvez nous l'envoyer en <a href="#" on:click={()=>open=false}>cliquant ici</a>
{:else if scan===false}
    En cliquant sur le boutton ci-dessous, votre navigateur va ouvrir la caméra intégrée à votre appareil :<br><br>
    <ul>
        <li>Si vous êtes sur smartphone, l'appareil photo qui se trouve au dos de votre téléphone.</li>
        <li>Si vous êtes sur ordinateur, votre webcam.</li>
    </ul>
    <a href="#" role="button" on:click={()=>pictureModal = true}>Commencer</a>
    <MobilePicture bind:open={pictureModal} {student}/>
{/if}


<style>
    
    .faded{
        opacity: 0.8;
    }

    .selected{
        font-weight:600;
    }

    .selected, .faded{
        margin: 5px;
    }

    li li{
        list-style:circle;
    }
</style>
