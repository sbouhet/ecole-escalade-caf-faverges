<script>
    import { currentSeason } from "$utils/stores"
    import {_updateDoc} from "$utils/firebase/firestore/basics"
    import {params} from '@roxi/routify'
    import { getAgeGroupFromDayUrl } from "$utils/ageGroups"
    import {translatePaymentType} from "$utils/TRANSLATE"
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import OtherFormsOfPayment from '$components/modals/OtherFormsOfPayment.svelte'
    import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { getApp } from "firebase/app"
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    export let student, open
    const functions = getFunctions(getApp())
    connectFunctionsEmulator(functions, "localhost", 5001)
    const getPaymentLinkFromHelloAsso = httpsCallable(functions, "getPaymentLinkFromHelloAsso")

    $:id = student.id
    $:firstName = student.public.firstName
    $:lastName = student.public.lastName
    $:email = student.private.emails[0]
    $:status = student.public.seasons[$currentSeason.name].payment
    $:paymentType = student.public.seasons[$currentSeason.name].paymentType
    $:ageGroup = getAgeGroupFromDayUrl(student.public.seasons[$currentSeason.name].day, $currentSeason.days, $currentSeason.ageGroups)
    $:price = ageGroup.price
    $:priceDividedByThree = Math.ceil((price * 100) / 3)/100

    let openOtherPaymentModal = false
    let payInThree = false
    let loading = false

    const handleClick = async ()=>{
        try {
            if(loading)return
            loading = true
            //TODO CHANGE AMOUNT !!!
            const result = await getPaymentLinkFromHelloAsso({firstName, lastName, id, email, totalAmount : 0.01, seasonName: $currentSeason.name, payInThree})
            window.location.href = result.data.link
        } catch (error) {
            console.log(error)
            loading = false
        }
    }
</script>

<OtherFormsOfPayment bind:open={openOtherPaymentModal} {id}/>

<details open={open}>
    <summary role="button" class="outline"><Boolean value={status} big={true}/>Étape 2 : Éffectuer le paiement en ligne pour les cours</summary>
        {#if status === "no"}
            {#if $params.code === "succeeded"}
                <div>Votre paiement à bien été recu, il sera validé dans quelques minutes.</div>
            {:else}
                <div class="card">
                    <small>
                        Ce montant correspond seulement aux cours d'escalade et ne comprends pas le coût de la licence.
                        La licence est obligatoire car elle comprend une assurance (voir étape suivante).
                    </small>
                    
                </div>
                {#if $params.code === "refused"}
                    <br>
                    <ErrorMessage error="La transaction a échouée"/>
                {/if}
                <br>
                Total : <b>{price} €</b><br>
                
                Payer en trois fois &nbsp;
                <input type=checkbox role="switch" bind:checked={payInThree}>
                {#if payInThree}
                    <br><br>
                    Montant à payer maintenant : <b>{priceDividedByThree} €</b> <br>
                    Montant prélevé le 1er novembre : <b>{priceDividedByThree} €</b> <br>
                    Montant prélevé le 1er mars : <b>{priceDividedByThree} €</b>
                {/if}
                <br><br>
                {#if loading}
                    <a href="" role="button" aria-busy={true} disabled>Merci de patienter...</a>
                {:else}    
                    <a href="" role="button" on:click={handleClick}>Cliquez ici pour payer
                        <b>
                            {#if payInThree}
                                {priceDividedByThree} €
                            {:else}
                                {price} €
                            {/if}
                        </b>&nbsp;&nbsp;
                        <small>(carte bleue)</small>
                    </a>
                {/if}
                <br><br>
                <small>
                    Le paiement par carte bleue est recommandé. Si vous souhaitez utiliser un autre moyen de paiement, cliquez sur le lien suivant :
                    <br>
                    <a href="" class="secondary" on:click={()=>openOtherPaymentModal=true}>Je ne souhaite pas payer par carte bleue</a>
                </small>
            {/if}
        {:else if status === "waiting" && paymentType}
            Vous avez choisi de régler par {translatePaymentType(paymentType)}.<br>
            <br>
            Nous attendons votre reglement de <b>{price} €</b> avant le 15 septembre.<br>
            <span style="color:red">Après cette date, votre place sera proposée aux personnes inscrites sur la liste d'attente.</span>
            <br><br>
            Merci de mettre votre règlement dans une enveloppe intitulée
            <b>"Ecole d'escalade + NOM + PRENOM"</b>
            et la déposer (ou l'envoyer) dans la boite aux lettre du CAF de Faverges à l'adresse suivante :
            <br><br>
            <div class="card">
                CAF de Faverges<br>
                <b>La Soierie</b><br>
                141 Route d'Albertville<br>
                74210 Faverges<br>
                <a href="https://goo.gl/maps/GziQXf6B5Pe8eqcb6" target="_new">Lien Google Maps</a>
                <br><br>
                La boite au lettre se trouve à l'entrée du local du CAF, sur la gauche du batiment de la Soierie (panneau en bois).
            </div>
            <br>
            Si vous souhaitez payer en trois fois, vos chèques seront ecaissés le 1er octobre, le 1er novembre et le 1er mars.
    {:else if status === "yes"}
            <div style="color:green">Votre paiement est validé !</div>
    {/if}
</details>


<style>
   
    .card{
        background-color: rgba(0, 0, 0, 0.05);
        border-left: 6px solid #1F95C1;
        padding: 20px;
    }
</style>
