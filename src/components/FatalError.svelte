<script>
    export let error
    let open = true
</script>

<dialog open={open}>
  <article>
    <h3>Ooops un problème est survenu !</h3>
    <p style="color:red">
        {#if error}
            ⚠ {error}
        {:else}
        Erreur inconnue
        {/if}
    </p>
    <p>
      Veuillez contacter notre équipe : caf.faverges.ffcam@gmail.com
    </p>
    <footer>
      <a href="#" role="button" on:click={()=>open=false} class="contrast">Confirm</a>
    </footer>
  </article>
</dialog>