<script>
    import { _getDoc, _getDocs, _query } from '$utils/firebase/firestore/basics';
     import {params} from '@roxi/routify'
     const eventId = $params.eventId
     let event, loading
     $:if (eventId) {
        getEvent()
     }

     const getEvent = async () =>{
        loading = true
        if (eventId==='latest') {
            const events = await _query('events', 'timestamp', '>', 0, 'timestamp', 'desc' )
            event = events[0]

        }else{
            const doc = await _getDoc('events', eventId)
            event = doc
        }
        loading = false
     }
</script>

{#if eventId}
    {#if loading}
        loading
    {:else}
        {#if event}
            <h1>{event.data().title}</h1>
            <center><h3>Catégories</h3></center>
            <div class="container">
                {#each event.data().categories as cat, i}
                    <div class="button">
                        <a href="./{event.id}/{i}/points" role="button">{cat}</a>
                    </div>
                {/each}
                <div class="button">
                    <a href="/prive/mod/noel/events/{event.id}" role="button" class='outline'>Admin</a>
                </div>
            </div>
        {:else}
            Pas d'évènement
        {/if}
    {/if}
{:else}
    Pas d'id
{/if}

<style>
    .container{
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .button{
        margin: 10px;
    }

    a{
        width: 200px;
    }

</style>