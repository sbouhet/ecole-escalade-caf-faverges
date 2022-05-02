<script>
    export let context //just to hide warning in console
    import { copySeason } from '$firestore/copySeason'

    let oldSeasonName, newSeasonName
    const handleCopy = async()=>{
        let result = window.confirm(`Copy ${oldSeasonName} to ${newSeasonName} ?`)
        if(!result) return
        copySeason(oldSeasonName, newSeasonName)
    }
</script>

<section>
    <h4>Copy season</h4>
    <label for="oldSeasonName">Old season name :</label>
    <input type="text" id="oldSeasonName" bind:value={oldSeasonName} />
    <label for="newSeasonName">New season name :</label>
    <input type="text" id="newSeasonName" bind:value={newSeasonName} />

    <button on:click|preventDefault={handleCopy}>Copy Season</button>
</section>
