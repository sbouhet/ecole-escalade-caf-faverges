<script>
    import { currentSeason } from '$utils/stores'
    import JSZip from 'jszip';
    import { saveAs } from 'file-saver';
    import {
    getStorage,
    listAll,
    ref,
    getDownloadURL,
    getMetadata,
    } from 'firebase/storage';
    let input = $currentSeason.name

    export const downloadFolderAsZip = async () => {
        const jszip = new JSZip();
        const storage = getStorage();
        const folderRef = ref(
            storage,
            `medicalCertificates/${input}`
        );
        const folder = await listAll(folderRef);
        const promises = folder.items
            .map(async (item) => {
            const file = await getMetadata(item);
            const fileRef = ref(storage, item.fullPath);
            const fileBlob = await getDownloadURL(fileRef).then((url) => {
                return fetch(url).then((response) => response.blob());
            });
            jszip.file(file.name, fileBlob);
            })
            .reduce((acc, curr) => acc.then(() => curr), Promise.resolve());
        await promises;
        const blob = await jszip.generateAsync({ type: 'blob' });
        saveAs(blob, `Certificats_medicaux_${$currentSeason.name}.zip`);
    };
</script>

<h1>Télécharger les certificats médicaux</h1>

<form on:submit|preventDefault={downloadFolderAsZip}>
    Saison:
    <input type="text" bind:value={input}>
    <button>Télécharger</button> 
  
</form>

<style>
    form{
        max-width: 200px;
    }
</style>

