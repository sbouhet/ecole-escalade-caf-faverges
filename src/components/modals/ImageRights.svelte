<script>
    import { subscriptionStatus} from '$utils/stores'
    export let adult

</script>

<dialog open>
  <article>
      <h2>Autorisation de droit à l’image</h2>
   
(diffusion, publication, reproduction ou commercialisation)

 
dans le cadre des activités de l’école d’escalade saison 2021/2022 l’association Le Club
Alpin de Faverges-Seythenex route d’albertville 74210 Faverges - Seythenex à réaliser
des prises de vue photographiques, des vidéos ou des captations numériques.
En conséquence de quoi et conformément aux dispositions relatives au droit à l’image,
j’autorise…Le club alpin français de Faverges à fixer, reproduire et communiquer au
public les photographies, vidéos ou captations numériques prises dans le cadre associatif.
Les images pourront être exploitées et utilisées directement par l’association sous toute
forme et tous supports connus et inconnus à ce jour, pour un territoire illimité, sans
limitation de durée, intégralement ou par extraits et notamment : presse, livre, supports
d’enregistrement numérique, exposition, publicité, projection publique, concours, site
internet, réseaux sociaux.
Le bénéficiaire de l’autorisation s’interdit expressément de procéder à une exploitation des
photographies susceptible de porter atteinte à la vie privée ou à la réputation, et d’utiliser
les photographies, vidéos ou captations numériques de la présente, dans tout support ou
toute exploitation préjudiciable.
Je me reconnais être entièrement rempli de mes droits et je ne pourrai prétendre à aucune
rémunération pour l’exploitation des droits visés aux présentes.
Je garantis que ni moi, ni le cas échéant la personne que je représente, n’est lié par un
contrat exclusif relatif à l’utilisation de mon image ou de mon nom.
Pour tout litige né de l’interprétation ou de l’exécution des présentes, il est fait attribution
expresse de juridiction aux tribunaux français.
    <footer>
        <a href="#" role="button" class="secondary outline" on:click={()=>$subscriptionStatus=null}>Annuler</a>
        {#if adult}
            <a href="#" role="button" on:click={()=>$subscriptionStatus='readyToCheck'}>J'accèpte</a>
        {:else}
            <a href="#" role="button" on:click={()=>$subscriptionStatus='parentalAuthorization'}>J'accèpte</a>
        {/if}
    </footer>
  </article>
</dialog>