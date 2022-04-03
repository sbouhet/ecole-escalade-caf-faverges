<script>
    import ParentInfo from './ParentInfo.svelte'
    import ChildInfo from './ChildInfo.svelte'

    let nbOfParents = 1
    const removeParent = ()=>{if (nbOfParents>1) nbOfParents--}
</script>

<section>

    <ChildInfo />
    {#each Array(nbOfParents) as _, i}
    <ParentInfo nb={i+1} />
    {/each}
    
    <button class="outline" on:click|preventDefault={()=>nbOfParents++}>Ajouter un parent</button>
    {#if nbOfParents>1}
        <a href="#" class="secondary" on:click|preventDefault={removeParent}>Supprimer un parent</a>
    {/if}
    
</section>



<style>
    .test{
        
        right: 0;
    }
</style>