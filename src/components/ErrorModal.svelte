<script>
    import Logo from '$components/Logo.svelte'
    import {error, fatal} from '$utils/stores'
    console.log($error)
    let errorLines = []
    if($error) errorLines = $error.toString().split(':')

    const handleClick = ()=>{
        if($fatal){
            location.reload()
        }else{
            $fatal = false
            $error = null
        }
    }
</script>

<dialog open>
  <article>
    <h3>Ooops un problème est survenu !</h3>
    <p>
      Veuillez contacter notre équipe : <b>caf.faverges.ffcam@gmail.com</b>
    </p>
    
    {#if errorLines.length>1}
        <div class="console">
            {#each errorLines as line}
                {#if line.includes("()") && line.includes("=>")}
                    <div class="function">
                        <Logo name="js"/>
                        <span class="path">{line.split("=>")[0]}</span>
                        &nbsp;&nbsp;
                        <span class="name">{line.split("=>")[1]}</span>
                    </div>
                {:else if line.includes("svelte") && line.includes("=>")}
                    <div class="svelte">
                        <Logo name="svelte"/>
                        <span class="path">{line.split("=>")[0]}</span>
                        &nbsp;&nbsp;
                        <span class="message">{line.split("=>")[1]}</span>
                    </div>
                {:else if line==="Error"}
                    &nbsp;
                {:else}
                    <div class="other">{line}</div>
                {/if}
            {/each}
        </div>
    {:else}
        <div class="other">
            {#if $error}
                {$error}
            {:else}
                Erreur inconnue
            {/if}
        </div>
    {/if}

    <footer>
        <a href="#" role="button" on:click={handleClick} class="contrast">Confirmer</a>
    </footer>
  </article>
</dialog>

<style>
    .function .name{
        color:chartreuse;
        font-size: medium;
      
    }
    .path{
        color:white;
        font-size: small;
    }
    .svelte .message{
        color: cyan;
        font-size: medium;
    }
    .other{
        margin: 10px 0;
        color:magenta;
    }
    .console div{
        padding: 7px;
    }
    .console .other{
        font-size: large;
    }

    .console{
        background-color: rgb(37, 37, 26);
        padding: 10px;
        margin: 20px 0;
    }
</style>