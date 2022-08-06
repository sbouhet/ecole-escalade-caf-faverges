<script>
    import { _getDoc, _query, _updateDoc } from '$utils/firebase/firestore/basics'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { seasons } from "$utils/seasons"
    import { printName } from '$utils/printName'
    import { currentDay, currentSeason } from '$utils/stores'
    import { getDayUrl } from '$utils/days'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import { validateDateOfBirth } from '$utils/dateOfBirth'

    const getMyIds = httpsCallable(getFunctions(), 'getMyIds')
    const resubscribe = httpsCallable(getFunctions(), 'resubscribe')
    let error, loading, success

    const getMyStudents = async()=>{
        await new Promise(r => setTimeout(r, 2000));
        const pastStudents = await _query("students", `seasons.${seasons().last}.status`, ">", "")
        const response = await getMyIds()
        console.log(response)
    
        if (response.data.statusCode === 200) {
            const myIds = response.data.body.myIds
            const myStudents = pastStudents.filter(x=>myIds.includes(x.id))
            console.log(myStudents)
            return myStudents
        } else {
            console.log(response)
            error = response.data.message
            return
        }
    }

    const myStudents = getMyStudents()


    const handleClick = async (id)=>{
        try {
            if(loading) return
            error = null
            success = false
            loading = true
            const privateDoc = await _getDoc("students", id, "privateCol", "privateDoc")
            const dateOfBirth = privateDoc.data().dateOfBirth
            const status = validateDateOfBirth(dateOfBirth, $currentDay, $currentSeason)
            if(!status.valid) throw status.msg
            const data = {id, oldSeasonName: seasons().last, newSeasonName: $currentSeason.name, dayUrl: getDayUrl($currentDay)}
            const response = await resubscribe(data)
            console.log(response)
            if (response.data.statusCode === 200) {
                console.log("success !")
                success = true
            } else {
                throw response.data.message
            }
            loading = false
        } catch (e) {
            console.error(e)
            loading = false
            error = e
        }
    }

</script>

{#await myStudents}
    <div>Recherche des vos élèves inscrits l'année dernière</div>
    <br>
    <div role="button" aria-busy=true>Merci de patienter...</div>
{:then myStudents}
    <div>Cliquez sur un élève à ré-inscrire</div>
    <br>

    {#each myStudents as student}
        <div role="button" on:click={()=>handleClick(student.id)}>{printName(student.data())}</div>
    {/each}
{/await}

<br><br>

{#if error}
    <ErrorMessage {error} />
{:else if success}
    <div>Ré-inscription réussie</div>
{:else if loading}
    <div aria-busy=true>Merci de patienter...</div>
{/if}
    
<br><br>

<style>

    div{
        margin-right: 10px;
    }
</style>