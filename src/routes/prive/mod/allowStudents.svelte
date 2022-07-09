<script>
    import {_getDoc, _updateDoc, _setDoc} from '$firestore/basics'
    let priorityStudents = []
    let adminDoc

    const run = async()=>{
        const ref = await _getDoc("admin","admin")
        adminDoc = ref.data()
        priorityStudents = adminDoc.priorityStudents
    }

    run()

    const update = async()=>{
        console.log("start")
        const result = await _updateDoc({...adminDoc, priorityStudents}, "admin", "admin")
        alert("Fini")
    }
</script>

<button on:click={update}>Mettre à jour</button>

{#each priorityStudents as student, i}
    <div>
        <input type="checkbox" role="switch" bind:checked={priorityStudents[i].allowed}>
        <span class={priorityStudents[i].allowed?"allowed":''}>
            {student.firstName} {student.lastName}
        </span>
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