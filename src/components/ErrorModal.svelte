<script>
    export let message = "Une erreur est survenue"
    export let title = "Erreur"
</script>

<dialog open>
  <article>
    <h3>{title}</h3>
    <p>
      {message}
    </p>
    <footer>
      <a href="#cancel" role="button" class="secondary">Cancel</a>
    </footer>
  </article>
</dialog>