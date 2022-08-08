<script>
    import DisplayArray from '$components/htmlElements/DisplayArray.svelte'
    import DisplayObject from '$components/htmlElements/DisplayObject.svelte'
    export let array = []
    export let origin
    export let studentId
</script>

{#if array && Array.isArray(array)}
    {#if array.length}
        <ul>
            {#each array as element, i}
                <li>
                    {#if element == null}
                    <a href={`?path=${origin}[${i}]`}><strong>{element}</strong> </a>
                    {:else}
                        {#if typeof element === "object"}
                            {#if Array.isArray(element)}
                                <DisplayArray array={element} origin={`${origin}[${i}]`} studentId={studentId}/>
                            {:else}
                                <DisplayObject object={element} origin={`${origin}[${i}]`} studentId={studentId}/>
                            {/if}
                        {:else}
                            <a href={`?path=${origin}[${i}]`}><strong>{element}</strong> </a>
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
