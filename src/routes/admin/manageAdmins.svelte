<script>
    import { httpsCallable } from "firebase/functions"
    import { functions } from '$utils/firebase/firebase'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import {collection,query,where,onSnapshot} from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"


    const addAdminRole = httpsCallable(functions, 'addAdminRole');
    const removeAdminRole = httpsCallable(functions, 'removeAdminRole');
    let email = ''
    let error = null
    let error2 = null
    let msg = ' '
    let mod = true

    const handleAdd = () => {
        msg = 'Merci de patientez...'
        error = null
        addAdminRole({ email, mod }).then(result => {
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
        removeAdminRole({ email, mod }).then(result => {
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
    let mods = []
    const q = query(collection(db, "users"), where("admin", "==", true))
    const r = query(collection(db, "users"), where("mod", "==", true))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        admins = []
        querySnapshot.forEach((userDoc) => {
        admins.push(userDoc.data())
        })
        console.log(admins)
        console.log(`Found ${admins.length} admins`)
    })
    const unsubscribe2 = onSnapshot(r, (querySnapshot) => {
        mods = []
        querySnapshot.forEach((userDoc) => {
        mods.push(userDoc.data())
        })
        console.log(mods)
        console.log(`Found ${mods.length} mods`)
    })
  
</script>
<section>
    <input type="text" bind:value={email}>
    <label for="switch">
    <input type="checkbox" id="switch" name="switch" role="switch" bind:checked={mod}>
    Modérateur
  </label>
  {#if mod}
      <button on:click={handleAdd}>MAKE MOD</button>
    <button on:click={handleRemove}>REMOVE MOD</button>
  {:else}
    <button on:click={handleAdd}>MAKE ADMIN</button>
    <button on:click={handleRemove}>REMOVE ADMIN</button>
  {/if}
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
    <h4>Modérateurs:</h4>
    <ul>
        {#each mods as mod}
            <li>{mod.email}</li>
        {/each}
    </ul>
</section>




