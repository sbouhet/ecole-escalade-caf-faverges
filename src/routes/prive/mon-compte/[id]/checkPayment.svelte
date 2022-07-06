<script>
    import { currentSeason, error, fatal } from "$utils/stores"
    import {params, goto} from '@roxi/routify'
    import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { getApp } from "firebase/app"
    const functions = getFunctions(getApp())
    //connectFunctionsEmulator(functions, "localhost", 5001)
    const changePaymentStatus = httpsCallable(functions, "changePaymentStatus")
    const setPaymentType = httpsCallable(functions, "setPaymentType")
    
/*     const run = async ()=>{
        console.log($params.checkoutIntentId)
        if ($params.code === "succeeded") {
            console.log("payment done, change status")
            const result = await changePaymentStatus({seasonName: $currentSeason.name,studentId: $params.id, status:"yes", checkoutIntentId:$params.checkoutIntentId })
            console.log(result)
            const result2 = await setPaymentType({seasonName: $currentSeason.name,studentId: $params.id, paymentType:"CB"})
            console.log(result2)
            
        }else{
            $error = 'Une erreur est survenue lors du paiement'
        }
        $goto(`/prive/mon-compte/[id]`, {id:$params.id, payment: "true"})
    }
    
    run() */

</script>


<div aria-busy=true>Merci de patienter...</div>
