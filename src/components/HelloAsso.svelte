<script>
    import { currentSeason } from "$utils/stores"
    import { getAgeGroupFromDayUrl } from "$utils/ageGroups"
    import Boolean from '$components/Boolean.svelte'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getApp } from "firebase/app"
    export let student
    const functions = getFunctions(getApp())
    const checkPayment = httpsCallable(functions, "checkPayment")

    $:id = student.public.id
    $:firstName = student.public.firstName
    $:lastName = student.public.lastName
    $:status = student.public.seasons[$currentSeason.name].payment
    $:ageGroup = getAgeGroupFromDayUrl(student.public.seasons[$currentSeason.name].day, $currentSeason.days, $currentSeason.ageGroups)
    //$:slug = ageGroup.slug
    //FOR TESTING REMOVE TODO
    const slug = "test"
    $:price = ageGroup.price

    let link = `https://www.helloasso.com/associations/caf-de-faverges/adhesions/${slug}`
    let result = false
    let loading = false

    const handleClick = async ()=>{
        if(loading)return
        loading = true
        //const users = await getUsersFromHelloAsso()
        result = await checkPayment({firstName, lastName, slug, id, seasonName:$currentSeason.name})
        loading = false
        console.log(result)
    }
</script>

<details>
    <summary><Boolean value={status} big={true}/>Étape 2 : Éffectuer le paiement en ligne pour les cours</summary>
    {#if status === "no"}
        <p>
            Pour éffectuer le paiement des cours d'escalade, vous devez passer par la plateforme <b>HelloAsso</b>.
            Cliquez sur le lien ci-dessous pour accéder à la plateforme et revenez sur cette page une fois le paiement effectué.</p>
            
            <strong>
                Attention à bien indiquer le nom de l'élève pour qui vous faites le paiement.<br>
            </strong>
            <br>
            <a href={link} target="_new" style="font-size:x-large">Cliquez ici pour payer {price}€</a>
            <small>&nbsp;(Paiement en 3 fois disponible)</small>
            <br>
            <br>
            <p>Vous avez payé ? cliquez sur le bouton ci-dessous pour vérifier la transaction et valider cette étape.</p>
            
            <a href="#" role="button" class="outline" on:click={handleClick}>
                {#if !loading}
                    Vérifier la transaction
                {:else}
                    Merci de patienter...
                {/if}
            </a>
    {:else if status === "waiting"}
            Plusieurs transactions trouvées avec le même nom, contactez notre équipe : caf.faverges.ffcam@gmail.com
    {:else if status === "yes"}
            <div style="color:green">Votre paiement est validé !</div>
    {/if}
</details>


<style>
    summary{
        font-weight:bold;
    }
</style>
