<script>
    import { httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { functions } from '$utils/firebase/firebase'    
    import PaymentsTable from "$components/tables/PaymentsTable.svelte"
    import {normalize} from '$utils/normalize'
    connectFunctionsEmulator(functions, "localhost", 5001)

    const getItemsFromHelloAsso = httpsCallable(functions, 'getItemsFromHelloAsso')
    const getOrdersFromHelloAsso = httpsCallable(functions, 'getOrdersFromHelloAsso')
    const getPaymentsFromHelloAsso = httpsCallable(functions, 'getPaymentsFromHelloAsso')

    let slug, id, search, loading, normalizedSearch
    let payments = []

    const getItems = async()=>{
        console.log("START")
        const result = await getItemsFromHelloAsso({search})
        console.log(result.data)
    }

    const getOrders = async()=>{
        console.log("START")
        const result = await getOrdersFromHelloAsso({search})
        console.log(result.data)
    }

    const getPayments = async()=>{
        if(loading) return
        payments = []
        loading = true
        if(search) normalizedSearch = normalize(search)
        const result = await getPaymentsFromHelloAsso({search:normalizedSearch})
        console.log(result.data)
        payments = result.data.body
        loading = false
    }

    
</script>

<h1>Paiements</h1>

<!-- <button on:click={()=>console.clear()}>Clear</button> -->
<!-- Slug: <input type="text" bind:value={slug}> -->
<!-- Id: <input type="text" bind:value={id}> -->
<form on:submit|preventDefault={getPayments}>
    <span data-tooltip="Nom, Prénom ou adresse email">Recherche : (optionnel)</span>
    <br><br>
    <input type="text" bind:value={search}>
    
    <!-- <a href='' role='button' on:click={getItems}>Get items</a> -->
    <!-- <a href='' role='button' on:click={getOrders}>Get orders</a> -->
    <a href='' role='button' on:click={getPayments} aria-busy={loading}>Afficher les 100 derniers paiements</a>
</form>
{#if payments.length}
    {payments.length} paiements trouvés
{/if}
<br>
<br>
<PaymentsTable {payments}/>

<style>
    input{
        max-width: 300px;
    }
</style>