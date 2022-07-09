<script>
    export let context //just to hide warning in console
    import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { getAgeGroupName } from "$utils/ageGroups"
    import { getHeaderInfo } from "$utils/TRANSLATE"
    import Tooltip from "$components/htmlElements/Tooltip.svelte"

    
    const getAllSeasons = async()=>{
        const seasons = []
        const querySnapshot = await getDocs(collection(db, "seasons"))
        querySnapshot.forEach((doc) => {
            seasons.push(doc.data())
        })
        return seasons
    }

    let seasons = getAllSeasons()
    let selectedSeason

    const createNewSeason = async (season)=>{
        if(!season || !season.name) throw "No season or season name"
        const docRef = doc(db, "seasons", season.name);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            alert("Cette saison existe déjà, modifiez le nom de la nouvelle saison")
            return
        } else {
            await setDoc(doc(db, "seasons", season.name), season)
            alert("La saison a été créée")
        }
    }
</script>



<h2>Nouvelle saison</h2>

<div style="max-width: 500px;">
    {#await seasons}
        Merci de patienter
    {:then seasons} 
        <label for="seasons">Saison à copier</label>
        <select id="seasons" bind:value={selectedSeason}>
            {#each seasons as season}
                <option value={season}>{season.name}</option>
            {/each}
        </select>
    {/await}

    {#if selectedSeason}
        <label for="newSeasonName">Nom de la nouvelle saison :</label>
        <input type="text" id="newSeasonName" bind:value={selectedSeason.name} />
    {/if}
</div>

{#if selectedSeason}
    <table>
        <thead>
            <tr>
                {#each Object.keys(selectedSeason).sort() as key}
                    {#if !Array.isArray(selectedSeason[key])}
                        <th scope="col">
                            <Tooltip msg={getHeaderInfo(key)}>
                                {key}
                            </Tooltip>
                        </th>
                    {/if}
                {/each}
            </tr>
        </thead>
        <tbody>
            <tr>
                {#each Object.keys(selectedSeason).sort() as key}
                        {#if !Array.isArray(selectedSeason[key])}
                            <td>
                                <input type="text" bind:value={selectedSeason[key]}>
                            </td>
                        {/if}
                {/each}
            </tr>
        </tbody>
    </table>

    {#each  Object.keys(selectedSeason).sort() as arrayName }
        {#if Array.isArray(selectedSeason[arrayName])}
        <h5>{arrayName}</h5>
        <table>
            <thead>
                <tr>
                    {#if arrayName === "ageGroups"}
                        <th>Index</th>
                    {:else if arrayName === "days"}
                        <th>AgeGroup</th>
                    {/if}
                    {#each Object.keys(selectedSeason[arrayName][0]).sort() as key}
                        <th scope="col">
                            <Tooltip msg={getHeaderInfo(key)}>
                                {key}
                            </Tooltip>
                        </th>
                    {/each}
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each selectedSeason[arrayName] as row, i}
                    <tr>
                        {#if arrayName === "ageGroups"}
                            <td>
                                <input type="text" disabled value={`${i}      (${getAgeGroupName(row)})`}>
                            </td>
                        {:else if arrayName === "days"}
                            <td>
                                <input type="text" disabled value={getAgeGroupName(selectedSeason.ageGroups[row.ageGroupIndex])}>
                            </td>
                        {/if}
                        {#each Object.keys(selectedSeason[arrayName][0]).sort() as key}
                            <td>
                                <input type="text" bind:value={selectedSeason[arrayName][i][key]}>
                            </td>
                        {/each}
                        <td>
                            <div on:click={()=>{selectedSeason[arrayName].splice(i, 1); selectedSeason=selectedSeason}} style="cursor:pointer">❌</div>
                        </td>
                    </tr>
                {/each}
                <tr>
                    <div style="padding: 10px" on:click={()=>{selectedSeason[arrayName].push(selectedSeason[arrayName][0]); selectedSeason=selectedSeason}}>➕ Ajouter</div>
                </tr>
            </tbody>
        </table>
        {/if}
    {/each}


{/if}

<button on:click={()=>createNewSeason(selectedSeason)}>Créer la saison</button>


<style>
    table input{
        font-size: medium;
        padding: 0;
        margin:0;
    }
    thead tr th{
        font-size: medium;
    }
    td{
        padding: 2px;
    }
    tr{
        border: 0;
        cursor: default;
    }

    
</style>