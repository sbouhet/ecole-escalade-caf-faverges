<script>
    import {_getDoc, _updateDoc, _setDoc} from '$firestore/basics'
    let priorityStudents = []
    let adminDoc, loading
    let unsyncedStudents = []

    const run = async()=>{
        const ref = await _getDoc("admin","admin")
        adminDoc = ref.data()
        priorityStudents = adminDoc.priorityStudents
    }

    run()

    const update = async()=>{
        console.log("start")
        loading = true
        const result = await _updateDoc({...adminDoc, priorityStudents}, "admin", "admin")
        unsyncedStudents = []
        loading = false
    }
</script>

<button on:click={update}>Mettre à jour</button>

{#each priorityStudents as student, i}
    <div>
        <input type="checkbox" role="switch" bind:checked={priorityStudents[i].allowed} on:change={()=>unsyncedStudents=[...unsyncedStudents, student]}>
        <span class={priorityStudents[i].allowed?"allowed":''}>
            {student.firstName} {student.lastName}
        </span>
        {#if unsyncedStudents.includes(student)}
            <a href='#' on:click={update} aria-busy={loading}>Mettre à jour</a>
        {/if}
    </div>
{/each}

<button on:click={update}>Mettre à jour</button>
    

<style>
    .allowed{
        background-color: chartreuse;
    }

    div{
        margin: 25px;
    }
    span{
        padding: 10px;
        border-radius: 10px;
    }
</style>