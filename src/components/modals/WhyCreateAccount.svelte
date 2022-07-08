<script>
    export let open
</script>

<dialog {open}>
    <article>
        <h3>Pourquoi créer un compte ?</h3>
        Créer un compte nous permet de <b>valider votre adresse email</b>.
        Cela nous assure que vous recevrez bien toutes les informations que nous enverrons.<br>
        <br>
        C'est une étape obligatoire avant de pouvoir s'inscrire.<br>
        <br>
        Depuis votre éspace personnel vous pourrez gérer vos inscriptions,
        et effectuer les différentes démarches necessaires pour pouvoir participer aux cours d'escalade.<br>
        <br>
        Il vous suffit de renseigner votre adresse email et de créer un mot de passe.
        Vous recevrez ensuite un email qui contiendra un lien de validation. Cliquez dessus, et c'est fini !

        <footer>
            <a href="" role="button" on:click={()=>open=false}>C'est compris</a>
        </footer>
    </article>
</dialog>