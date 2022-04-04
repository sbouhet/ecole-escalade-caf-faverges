<script>
    import ParentInfo from './ParentInfo.svelte'
    import ChildInfo from './ChildInfo.svelte'
    import { subscription } from '$utils/stores'

    $: nbOfParents = $subscription.parents.length
    const removeParent = ()=>{
        if (nbOfParents<=1) return 
        $subscription.parents.pop()
        $subscription = $subscription
    }
    const addParent = ()=>{
        $subscription.parents.push({})
        $subscription = $subscription
    }
</script>

<section>

    <ChildInfo />
    {#each Array(nbOfParents) as _, i}
    <ParentInfo nb={i+1} />
    {/each}
    <div>

    </div>
    <div style="display:flex; justify-content:space-between">
         <div >
            <a href="#" role="button" class="outline" on:click|preventDefault={addParent}>✚ Ajouter un parent</a>
        </div>
        <div>
            {#if nbOfParents>1}
                <a href="#" class="outline delete" role="button" on:click|preventDefault={removeParent}>✕ Supprimer le dernier parent</a>
            {/if}
        </div>
    </div>
   
    
    
</section>

<style>
    .delete{
        color:red;
        border-color: red;
        opacity: 0.5;
    }
</style>


