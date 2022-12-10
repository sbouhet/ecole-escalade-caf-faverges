<script>
    import { _getDoc, _updateDoc, _addDoc, _getDocs, _deleteDoc } from '$utils/firebase/firestore/basics';
    import { COLORS } from '$utils/colors'
    import {params} from '@roxi/routify'
    let selectedGrade, selectedLine, gyms, selectedGym
    let selectedColor = {
        background: 'white',
    }
    if ($params.gym) {
        selectedGym = $params.gym
    }
    const delRoute = async(routeId)=>{
        await _deleteDoc('gyms', selectedGym, 'routes', routeId)
        console.log('done');
        location.reload()
    }

    const run = async ()=>{
        gyms = await _getDocs('gyms')
        
    }

    run()
</script>

{#if !selectedGym && gyms}
    Choisir une salle :<br><br>
    <ul>
        {#each gyms as gym}
            <li>
                <a href="#" on:click={()=>selectedGym=gym}>{gym.id}</a>
            </li>
        {/each}
    </ul>
{:else if selectedGym}
    <h1>{selectedGym.id}</h1>

    <h4>Couloir</h4>
    {#each selectedGym.data().lines as line, i}
        <span role="button" class="{selectedLine==i ? 'gradeButton' : 'gradeButton outline'}" on:click={()=>selectedLine=i}>{i+1}) <small>{line}</small> </span>
    {/each}
    <br><br>
    <h4>Cotation</h4>
    {#each GRADES as grade}
        <span role="button" class="{selectedGrade==grade ? 'gradeButton' : 'gradeButton outline'}" on:click={()=>selectedGrade=grade}>{grade}</span>
        {#if grade.includes("c+") || grade ==="4c"}
            <br>
        {/if}
    {/each}
    <br>
    <h4>Couleur</h4>
    {#each COLORS as color}
        <span style="background-image:repeating-linear-gradient({color.background}, {color.background2 || color.background}, {color.background}); color: {color.text}" role="button" class="colorButton"on:click={()=>selectedColor=color}>{color.name}</span>
    {/each}
    <br> <br><br><br> <br><br>
    <span style="color: {selectedColor.text};background-image:repeating-linear-gradient({selectedColor.background}, {selectedColor.background2 || selectedColor.background}, {selectedColor.background}); margin: 10px; font-size:x-large; padding:10px; border-radius:5px" >
        {#if selectedGrade}
            {selectedGrade} 
        {/if}
        {#if selectedColor && selectedColor.name}
            {selectedColor.name}
        {/if}
    </span>
        {#if selectedLine !== undefined}
            en ligne {selectedLine+1} ({selectedGym.data().lines[selectedLine]})
        {/if}
        <br><br>
    {#if selectedGrade && selectedColor.text && selectedLine !== undefined}
        <button on:click={addRoute}>Ajouter la voie</button>
    {:else}
        <button disabled>Ajouter la voie</button>
    {/if}
{/if}


<style>
    .colorButton{
        border: none;
        margin-right: 5px;
        margin-bottom: 10px;
        min-width: 80px;
        font-weight: bold;
    }

    .gradeButton{
        margin-right: 5px;
        margin-bottom: 5px;
        min-width: 80px;
    }
</style>