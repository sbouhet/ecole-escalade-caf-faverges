<script>
    import { currentSeason, error, fatal } from "$utils/stores"
    import {params, goto} from '@roxi/routify'
    import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
    import { getApp } from "firebase/app"
    const functions = getFunctions(getApp())
    //connectFunctionsEmulator(functions, "localhost", 5001)
    const changePaymentStatus = httpsCallable(functions, "changePaymentStatus")
    
    const run = async ()=>{
        
        if ($params.code === "succeeded") {
            console.log("payment done, change status")
            const result = await changePaymentStatus({seasonName: $currentSeason.name,studentId: $params.id, status:"yes"})
            console.log(result)
            
        }else{
            $error = 'Une erreur est survenue lors du paiment'
        }
        $goto(`/prive/mon-compte/[id]`, {id:$params.id})
    }
    
    run()

</script>


<div aria-busy=true>Merci de patienter...</div>
