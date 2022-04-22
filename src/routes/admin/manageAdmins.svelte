<script>
    import { getAuth } from "firebase/auth"
    import { httpsCallable } from "firebase/functions"
    import { functions } from '$utils/firebase/firebase'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import {collection,query,where,onSnapshot} from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"


    const removeAdminRole = httpsCallable(functions, 'removeAdminRole');
    const changeModStatus = httpsCallable(functions, 'changeModStatus');
    let email = ''
    let error = null
    let error2 = null
    let msg = ' '
    let modChecked = true
    $:field = modChecked ? "mod": "admin"
    let value = true

    const handleClick = () => {
        msg = 'Merci de patientez...'
        error = null
        changeModStatus({ email, field, value }).then(result => {
            msg = ''
            console.log(result.data);
            if(result.data.statusCode !== 200) {
              error = result.data.message
            }else{
             msg = result.data.message
             console.log(result.data.message)
            }
            getAuth().currentUser.getIdToken(true)
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
    <input type="checkbox" id="switch" name="switch" role="switch" bind:checked={modChecked}>
    Modérateur
  </label>
  <label for="switch">
    <input type="checkbox" id="switch" name="switch" role="switch" bind:checked={value}>
    Valeur : {value}
  </label>
  <button on:click={handleClick}>{field} : {value}</button>

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




