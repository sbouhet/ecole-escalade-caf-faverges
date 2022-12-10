<script>
    export let event, selectedCatIndex

    const toggleCategorie = (catIndex)=>{
        if (selectedCatIndex == catIndex) {
            selectedCatIndex = undefined
        }else{
            selectedCatIndex = catIndex
        }
    }
</script>


{#each event.data().categories as cat, i}
    <a href="#" role="button" class={selectedCatIndex==i?'':'outline'} on:click={()=>toggleCategorie(i)}>{cat}</a> &nbsp;
{/each}
