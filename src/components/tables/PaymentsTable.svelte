<!-- routify:meta reset -->
<script>    
    export let payments = []
    import { printName } from '$utils/printName'
    import Tooltip from "$components/htmlElements/Tooltip.svelte"

    let table
    $:if(table){
        new Tablesort(table)
    }
</script>


{#if payments.length > 0}
    <figure>
        <table role="grid" bind:this={table}>

            <!-- ****************   HEAD    ****************-->
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Nom</th>
                    <th scope="col">email</th>
                    <th scope="col">Montant</th>
                    <th scope="col">Facture</th>
                </tr>
            </thead>

            <!-- ****************     BODY     ************** -->
            <tbody>
                {#each payments as payment}
                    <tr>
                        <td>{dayjs(payment.date).format("DD/MM/YY HH:mm")}</td>
                        <td>{printName(payment.payer)}</td>
                        <td>{payment.payer.email}</td>
                        <td>{payment.amount/100} €</td>
                        <td ><a href={payment.paymentReceiptUrl} target="_new">
                            <Tooltip msg="Accès HelloAsso obligatoire">
                                facture
                           </Tooltip>
                        </a></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </figure>
{:else}
     <i style="color:grey">Aucun payment</i>
{/if}

