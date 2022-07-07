<script>
    import { currentSeason } from "$utils/stores"
    import {_updateDoc} from "$utils/firebase/firestore/basics"
    import {params} from '@roxi/routify'
    import { getAgeGroupFromDayUrl } from "$utils/ageGroups"
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import OtherFormsOfPayment from '$components/modals/OtherFormsOfPayment.svelte'
    import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { getApp } from "firebase/app"
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    export let student, open
    const functions = getFunctions(getApp())
    connectFunctionsEmulator(functions, "localhost", 5001)
    const getPaymentLinkFromHelloAsso = httpsCallable(functions, "getPaymentLinkFromHelloAsso")
    const changePaymentStatusToWaiting = httpsCallable(functions, "changePaymentStatusToWaiting")

    $:id = student.id
    $:firstName = student.public.firstName
    $:lastName = student.public.lastName
    $:email = student.private.emails[0]
    $:status = student.public.seasons[$currentSeason.name].payment
    $:ageGroup = getAgeGroupFromDayUrl(student.public.seasons[$currentSeason.name].day, $currentSeason.days, $currentSeason.ageGroups)
    $:price = ageGroup.price
    $:priceDividedByThree = Math.ceil((price * 100) / 3)/100

    const changeState = async ()=>{
        console.log("trying to change status")
        const result = await changePaymentStatusToWaiting({seasonName: $currentSeason.name,studentId: $params.id })
        console.log(result)
    }

    $:if($params.code == "succeeded") {
        changeState()
    }

    let result
    let openOtherPaymentModal = false
    let payInThree = false
    let loading = false

    const handleClick = async ()=>{
        try {
            if(loading)return
            loading = true
            //TODO CHANGE AMOUNT !!!
            result = await getPaymentLinkFromHelloAsso({firstName, lastName, id, email, totalAmount : 0.01, seasonName: $currentSeason.name, payInThree})
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
    <div class="card">
        <small>
            Ce montant correspond seulement aux cours d'escalade et ne comprends pas le coût de la licence.
            La licence est obligatoire car elle comprend une assurance (voir étape suivante).
        </small>
    
    </div>
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

           
    {:else if status === "waiting"}
            En attente de validation. <br>Si vous n'avez pas payé par carte bleue,
            nous attendons votre paiement par chèque, espèces ou chèque vacances. Vous avez jusqu'au 1er septembre pour nous faire parvenir votre paiement.
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
