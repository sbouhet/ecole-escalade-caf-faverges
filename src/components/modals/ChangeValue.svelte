<script>
    import {_getDoc, _updateDoc} from '$firestore/basics'
    import { onMount } from 'svelte'
    import { printName } from '$utils/printName';
    export let path, currentValue, student
    export let closeModal = false
    let input, inputForm
    onMount(() => inputForm.focus())
    $:if(!input) input = null

    const changePrivateValue = async (key, value="null")=>{
        await _updateDoc({[key]:value}, "students", student.id, "privateCol", "privateDoc")
    }
    const changePublicValue = async (key, value="null")=>{
        await _updateDoc({[key]:value}, "students", student.id)
    }

    const updateValue = async()=>{
        let answer = confirm('Êtes vous sûr de vouloir modifier la base de données ? Cette action est irreversible !')
        if(!answer) return
        const array = path.split('[')

        //if no array in key string
        if (array.length === 1) {

            //Private
           if (array[0].includes("private")){
                const string = array[0].split('private.')[1]
                changePrivateValue(string, input)

            //Public
            }else if (array[0].includes("public")){
                const string = array[0].split('public.')[1]
                console.log(string);
               changePublicValue(string, input)
           }else{
            alert('Erreur: impossible de modifier cette valeur')
           }
        //if array in key string
        } else {
             //Private
           if (array[0].includes("private")){
                const string = array[0].split('private.')[1]
                const array2 = array[1].split('].')
                const index = parseInt(array2[0])
                const key2 = array2[1]
                const doc = await _getDoc("students", student.id, 'privateCol', 'privateDoc')
                const privateArray = doc.data()[string]
                const element = privateArray[index]
                if (key2) {
                    element[key2] = input
                }else{
                    privateArray[index] = input
                }
                changePrivateValue(string, privateArray)

            //Public
            }else if (array[0].includes("public")){
                const string = array[0].split('public.')[1]
                const array2 = array[1].split('].')
                const index = parseInt(array2[0])
                const key2 = array2[1]
                const doc = await _getDoc("students", student.id)
                const publicArray = doc.data()[string]
                const element = publicArray[index]
                if (key2) {
                    element[key2] = input
                }else{
                    publicArray[index] = input
                }
                changePublicValue(string, publicArray)
           }else{
            alert('Erreur: impossible de modifier cette valeur')
           }
        }
        closeModal = true
    }

</script>

<dialog open>
    <article>
        <hgroup>
            <h3>Modifier la valeur</h3>
            <h5>{printName(student.public)}</h5>
        </hgroup>
        {path} :
        <strong>{currentValue}</strong>
        <br><br>
        <form on:submit|preventDefault={updateValue}>
            <input type="text" bind:value={input} bind:this={inputForm}>
        </form>
        <strong style="color:red">
            Vous allez changer cette valeur dans la base de données, cette action est irreversible !
        </strong><br><br>
        {#if typeof currentValue !== 'string'}
            Attention vous allez passer la valeur du type {typeof currentValue} au type 'string'
        {/if}
        
        <footer>
            <a href="#" on:click={updateValue} role="button">Mettre à jour</a>
            <a href="#" role="button" class="secondary" on:click={()=>closeModal=true}>Fermer</a>
        </footer>
    </article>
</dialog>
