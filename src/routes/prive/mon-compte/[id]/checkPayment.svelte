<script>
    import { currentSeason, error, fatal } from "$utils/stores"
    import {params, goto} from '@roxi/routify'
    import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { getApp } from "firebase/app"
    const functions = getFunctions(getApp())
    //connectFunctionsEmulator(functions, "localhost", 5001)
    const changePaymentStatusToWaiting = httpsCallable(functions, "changePaymentStatusToWaiting")
    let loading = true
    
    const run = async ()=>{
        
        if ($params.code === "succeeded") {
            const result = await changePaymentStatusToWaiting({seasonName: $currentSeason.name,studentId: $params.id})
            console.log(result)
            
        }else{
            $error = 'Une erreur est survenue lors du paiment'
        }
        $goto(`/prive/mon-compte/[id]`, {id:$params.id})
    }
    
    run()

</script>


<div aria-busy=true>Merci de patienter...</div>
