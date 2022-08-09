<script>
    import DisplayArray from '$components/htmlElements/DisplayArray.svelte'
    import DisplayObject from '$components/htmlElements/DisplayObject.svelte'
    import ChangeValue from '$components/modals/ChangeValue.svelte'
    export let object = {}
    export let origin, student
    let changeValue
    let closeModal = false
    let hideElements = []

    const toggleKey = (key)=>{
        if (hideElements.includes(key)) {
            hideElements = hideElements.filter(item => item !== key)
        } else {
            hideElements = [...hideElements,key]
        }
    }
</script>

{#if object && typeof object === "object"}
    <ul>
        {#each Object.keys(object).sort() as key}
            <li>
                <span on:click={()=>toggleKey(key)} class={typeof object[key] === "object" && object[key] != null?'pointer key':'key'}>{key} : </span>
                
                {#if typeof object[key] === "object" && object[key] != null}
                    <div class={hideElements.includes(key) ?'hidden':''}>
                        {#if Array.isArray(object[key])}
                            <DisplayArray array={object[key]} origin={`${origin}.${key}`} {student}/>
                        {:else}
                            <DisplayObject object={object[key]} origin={`${origin}.${key}`} {student}/>
                        {/if}
                    </div>
                {:else}
                    {#if typeof object[key] === "string" && object[key].includes('http')}
                        <a href={object[key]} target="_new">Lien</a>
                    {:else}
                        <a href="#" on:click={()=>{changeValue=`${origin}.${key}`;closeModal=false}}><strong>{object[key]}</strong> </a>
                        {#if changeValue === `${origin}.${key}` && !closeModal}
                            <ChangeValue {student} path={`${origin}.${key}`} currentValue={object[key]} bind:closeModal={closeModal}/>
                        {/if}
                    {/if}
                {/if}
              
            </li>
        {/each}
    </ul>
{:else}
    "Object" n'existe pas ou n'est pas un objet
{/if}

<style>
    li{
        list-style: none;
    }
    ul{
        border-left: 1px solid var(--primary);
    }
    .hidden{
        display: none;
    }
    .key{
        color:grey;
    }
    .pointer{
        cursor: pointer;
        text-decoration: underline;
        color: var(--contrast);
    }
</style>
