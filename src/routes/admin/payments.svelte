<script>
    import { httpsCallable } from "firebase/functions"
    import { functions } from '$utils/firebase/firebase'
    const getPayments = httpsCallable(functions, 'getPayments')

    const run = async()=>{
        console.log("START")
        const payments = await getPayments()
        console.log(payments)
    }
    run()
</script>

<h1>Paiments</h1>

<!-- {#await payments}
    merci de patienter... 
{:then payments}
    {#each payments as payment}
        {payment.amount}
    {/each}
{:catch}
    Erreur
{/await} -->