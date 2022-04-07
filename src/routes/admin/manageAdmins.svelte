<script>
    import { httpsCallable } from "firebase/functions"
    import { functions } from '$utils/firebase'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import {collection,query,where,onSnapshot} from "firebase/firestore"
    import { db } from "$utils/firebase"


    const addAdminRole = httpsCallable(functions, 'addAdminRole');
    const removeAdminRole = httpsCallable(functions, 'removeAdminRole');
    let email = ''
    let error = null
    let error2 = null
    let msg = ' '

    const handleAdd = () => {
        msg = 'Merci de patientez...'
        error = null
        addAdminRole({ email: email }).then(result => {
            msg = ''
            console.log(result.data);
            if(result.data.errorInfo) {
              error = result.data.errorInfo
            }else if (result.data.message){
             msg = result.data.message
             console.log(result.data.message)
            }else{
                console.error('unexpected answer from function')
                msg = 'Erreur : contactez un administrateur'
                console.log(result.data)
            }
        }).catch(err=>{
            msg = ''
            error2 = err
            console.error(err)
        })
    }
    const handleRemove = () => {
        msg = 'Merci de patientez...'
        error = null
        removeAdminRole({ email: email }).then(result => {
            msg = ''
            console.log(result.data);
            if(result.data.errorInfo) {
                error = result.data.errorInfo
            }else if(result.data.message){
                msg = result.data.message
                console.log(result.data.message)
            }else{
                console.error('unexpected answer from function')
                msg = 'Erreur : contactez un administrateur'
                console.log(result.data)
            }
        }).catch(err=>{
            msg = ''
            error2 = err
            console.error(err)
        })
    }


    let admins = []
    const q = query(collection(db, "users"), where("admin", "==", true))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        admins = []
        querySnapshot.forEach((userDoc) => {
        admins.push(userDoc.data())
        })
        console.log(admins)
        console.log(`Found ${admins.length} admins`)
    })
  
</script>
<section>
    <input type="text" bind:value={email}>
    <button on:click={handleAdd}>MAKE ADMIN</button>
    <button on:click={handleRemove}>REMOVE ADMIN</button>
    {#if msg}
        <div>{msg}</div>  
    {/if}
    <ErrorMessage error={error} />
    <ErrorMessage error={error2} />
</section>

<section>
    <h4>Administrateurs :</h4>
    <ul>
        {#each admins as admin}
            <li>{admin.email}</li>
        {/each}
    </ul>
</section>




