<script>
    import {_query, _getDocs} from '$firestore/basics'

    let logs = []
    let tableLogs = []
    let uniqueLogs = []
    let unique = true

    const run = async()=>{
        const result = await _getDocs("helloAssoLogs")
        logs = result
        uniqueLogs = logs.filter((v,i,a)=>a.findIndex(v2=>(v2.data().body.data.id===v.data().body.data.id))===i)
        console.log(uniqueLogs)
        console.log(result)
    }

    run()

    $:if(unique){
        tableLogs = uniqueLogs
    }else{
        tableLogs = logs
    }
</script>
<hgroup>
    <h1>Logs</h1>
    <h5>{tableLogs.length}/{logs.length} logs</h5>
</hgroup>
Unique
<input type="checkbox" role="switch" bind:checked={unique}>
<table>
    <thead>

    </thead>
    <tbody>
        {#each tableLogs as log}
            <tr>
                <td>{dayjs.unix(log.id).format("DD/MM/YY HH:mm")}</td>
                <td>{log.data().body.data.date}</td>
                <td>{log.data().body.eventType}</td>
                <td>{log.data().body.data.payer.firstName}</td>
                <td>{log.data().body.data.payer.lastName}</td>
                <td>{log.data().body.data.payer.email}</td>
                <td>{log.data().body.data.id}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    tbody tr:hover{
  background-color: #1095c13d;

    }
</style>