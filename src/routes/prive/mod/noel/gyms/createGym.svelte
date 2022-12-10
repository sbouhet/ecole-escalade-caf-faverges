<script>
    import { _addDoc, _setDoc, _updateDoc } from "$utils/firebase/firestore/basics";
    let gymName, lineName, nameForm
    let lines = []
    const addLine = ()=>{
        lines = [...lines, lineName]
        lineName = ''
        nameForm.focus()
    }
    const removeLast = ()=>{
        lines.pop()
        lines = lines
    }

    const create = async ()=>{
        await _setDoc({lines}, 'gyms', gymName)
        console.log('done');
    }
</script>

<h1>Créer une salle</h1>

Nom de la salle :
<input type="text" bind:value={gymName}>

<form on:submit|preventDefault={addLine}>
    Ajouter un couloir :
    <input type="text" bind:value={lineName} bind:this={nameForm}>
    <a href="#" role="button" on:click={addLine}>Ajouter</a>
    <a href="#" role="button" on:click={removeLast} class='secondary outline'>Supprimer dernier</a>
</form>


<br><br>
<h3>Couloirs :</h3>
{#each lines as line, i}
    Ligne {i} : {line}<br>
{/each}

<button on:click={create}>Créer la salle</button>

