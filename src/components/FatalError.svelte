<script>
    import Logo from '$components/Logo.svelte'
    export let error
    let errorLines = []
    if(error){
        errorLines = error.toString().split(':')
        //errorLines.shift()
    }
    let open = true
    let details = false
</script>

<dialog open={open}>
  <article>
    <h3>Ooops un problème est survenu !</h3>
    <p>
      Veuillez contacter notre équipe : caf.faverges.ffcam@gmail.com
    </p>
    
    <!-- <br><a href="#" on:click={()=>details=!details}>Voir les détails</a> -->

    <div hidden={details}>
        {#if errorLines}
            {#each errorLines as line}
                {#if line.includes("Function") && line.includes("=>")}
                    <div class="function">
                        <Logo name="js"/>
                        <span class="path">{line.split("=>")[0].slice(9)}</span>
                        &nbsp;&nbsp;
                        <span class="name">{line.split("=>")[1]}</span>
                    </div>
                {:else if line.includes("File") && line.includes("=>")}
                    <div class="svelte">
                        <Logo name="svelte"/>
                        <span class="path">{line.split("=>")[0].slice(5)}</span>
                        &nbsp;&nbsp;
                        <span class="message">{line.split("=>")[1]}</span>
                    </div>
                {:else if line==="Error"}
                    &nbsp;
                {:else}
                    <div class="other">{line}</div>
                {/if}
            {/each}
        {:else}
            {#if error}
                <div class="other">{error}</div>
            {:else}
                Erreur inconnue
            {/if}
        {/if}
    </div>

    <footer>
      <a href="#" role="button" on:click={()=>open=false} class="contrast">Confirmer</a>
    </footer>
  </article>
</dialog>

<style>
    .function .name{
        color:chartreuse;
      
    }
    .path{
        color:white;
        font-size: small;
    }
    .function, .svelte{
        background-color: rgb(37, 37, 26);
        
    }
    .svelte .message{
        color: cyan;
    }
    .other{
        margin: 10px 0;
        color:red;
    }
    div{
        padding: 7px;
    }
</style>