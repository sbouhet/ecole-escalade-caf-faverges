<script>
    export let open
</script>

<dialog open={open}>
  <article>
    <h3>Comment trouver son numéro de licence ?</h3>
        <p>
          Votre numéro de licence est une serie de chiffres qui comment par 7421.<br>
          Ex: 742120190080
        </p>
    <br><hr><br>
    <div class="grid">
      <p>
        Si vous avez votre carte d'adhérent au CAF de Faverges, votre numéro de licence est indiqué dessus.
      </p>
      <img src="https://i.imgur.com/YG0Fa4Z.jpg" alt="carte">
    </div>
    <br><hr><br>
    <div class="grid">
      <p>
        Si vous n'avez pas encore recu votre carte pas de panique !
        Vous avez reçu un mail intitulé <b>"Votre adhésion FFCAM par internet"</b>
        Une attestation provisoire se trouve en pièce jointe. Vous y trouverez votre numéro de licence.
      </p>
      <img src="https://i.imgur.com/gXXL9Ae.jpg" alt="licence_provisoire" style="border:1px solid black; padding:10px">
    </div>
   
    <footer>
      <a href="#" role="button" on:click={()=>open=false}>C'est compris !</a>
    </footer>
  </article>
</dialog>

<style>
    img{
        max-width: 300px;
    }
</style>