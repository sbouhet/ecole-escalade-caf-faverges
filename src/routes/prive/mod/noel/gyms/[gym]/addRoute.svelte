<script>
    import { _getDoc, _updateDoc, _addDoc, _getDocs } from '$utils/firebase/firestore/basics';
    import {GRADES} from '$utils/grades'
    import {COLORS} from '$utils/colors'
  
    import {params} from '@roxi/routify'
    let selectedGrade, selectedLine, gym
    let selectedColor = {
        background: 'white',
    }
   
 
    const addRoute = async()=>{
        await _addDoc({
            line: selectedLine+1,
            grade:  selectedGrade,
            color: selectedColor.name,
        }, 'gyms', gym.id, 'routes')
        console.log('done');
        selectedLine = undefined
        selectedGrade= undefined
        selectedColor = {
        background: 'white',
        }
        window.scrollTo(0, 0);
    }

    const getGym = async ()=>{
        gym = await _getDoc('gyms', $params.gym)
    }

    getGym()
</script>

{#if gym}
    <h1>{gym.id}</h1>

    <h4>Couloir</h4>
    {#each gym.data().lines as line, i}
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
            en ligne {selectedLine+1} ({gym.data().lines[selectedLine]})
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