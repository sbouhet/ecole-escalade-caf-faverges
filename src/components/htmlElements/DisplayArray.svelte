<script>
    import DisplayArray from '$components/htmlElements/DisplayArray.svelte'
    import DisplayObject from '$components/htmlElements/DisplayObject.svelte'
    import ChangeValue from '$components/modals/ChangeValue.svelte'
    export let array = []
    export let origin, student
    let changeValue
    let closeModal = false
</script>

{#if array && Array.isArray(array)}
    {#if array.length}
        <ul>
            {#each array as element, i}
                <li>
                    {#if typeof element === "object" && element != null}
                        {#if Array.isArray(element)}
                            <DisplayArray array={element} origin={`${origin}[${i}]`} {student}/>
                        {:else}
                            <DisplayObject object={element} origin={`${origin}[${i}]`} {student}/>
                        {/if}
                    {:else}
                        <a href="#" on:click={()=>{changeValue=`${origin}[${i}]`;closeModal=false}}><strong>{element}</strong> </a>
                        {#if changeValue === `${origin}[${i}]` && !closeModal}
                            <ChangeValue {student} path={`${origin}[${i}]`} currentValue={element} bind:closeModal={closeModal}/>
                        {/if}
                    {/if}
                </li>
            {/each}
        </ul>
    {:else}
        Tableau vide
    {/if}
{:else}
    "Array" n'existe pas ou n'est pas un tableau
{/if}

<style>
    li{
        list-style: none;
        border-left: 4px solid var(--contrast);
        padding-left: 10px;
    }
   
</style>
