<script>
    import { subscription, currentDay, currentSeason, error, fatal, subscriptionStatus} from '$utils/stores'


</script>

<dialog open>
  <article>
    <h2>AUTORISATION PARENTALE</h2>
      

1. Ecole d'escalade :

Les activités proposées par le club alpin français de Faverges lors des cours et sorties de l’école d’escalade, se déroulent en milieu spécifique : SAE et escalade en falaise.

Ces milieux comportent des risques.

Ces activités sont encadrées par des professionnels de la discipline et par des bénévoles diplômés ou non du club mais dont les compétences et l'expérience dans les activités sont reconnues par le Club.

Les mineurs sont sous la responsabilité des encadrants du club uniquement pendant la durée officielle des cours ou de la sortie. En dehors de ces horaires, le club n’est plus responsable des mineurs.

Lors des sorties, les détails pratiques seront transmis aux parents.

2. Autorisations :

Je soussigné(e) M.

et/ou Mme. (parents ou responsable légal) autorise mon enfant à participer aux activités proposées par le Club alpin français de Faverges au sein de l'école d'escalade.

J'autorise aussi mon enfant à utiliser les moyens de transport personnel (voiture du professionnel et des bénévoles) ou minibus mis à leur disposition pour l'aller et le retour, du parking du local du CAF de Faverges au lieu de rendez-vous de la sortie.

En cas d’urgence, j’autorise / je n’autorise pas (rayer la mention inutile) les responsables de l’encadrement à prendre toutes les mesures rendues nécessaires par l'état de santé de mon enfant.

J’autorise / je n’autorise pas (rayer la mention inutile) les responsables de l’encadrement à utiliser les photos/vidéos de mon enfant, prises dans le cadre des activités pour réaliser des outils de communication (revue club, site club, site FFCAM, Dauphiné, affiches et flyers).
 <footer>
        <a href="#" role="button" class="secondary outline" on:click={()=>$subscriptionStatus=null}>Annuler</a>
        <a href="#" role="button" on:click={()=>$subscriptionStatus='readyToCheck'}>J'accèpte</a>
    </footer>  
</article>
</dialog>