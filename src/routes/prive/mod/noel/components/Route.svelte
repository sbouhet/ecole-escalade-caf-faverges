<script>
    import { _updateDoc } from '$utils/firebase/firestore/basics';
    import { arrayRemove, arrayUnion } from 'firebase/firestore';
    import { COLORS } from '../colors'
    export let route, event
    export let edit = false
    let del = edit
    let add = edit
    let background, background2, text

    $:if (route) {
        background = COLORS.filter(x=>x.name==route.color)[0].background
        background2 = COLORS.filter(x=>x.name==route.color)[0].background2
        text = COLORS.filter(x=>x.name==route.color)[0].text
    }

    const delRoute = async (route, event)=>{
        await _updateDoc({routes:arrayRemove(route)}, 'events', event.id)
    }
    const addRoute = async (route, event)=>{
        await _updateDoc({routes:arrayUnion(route)}, 'events', event.id)
    }

</script>

{#if route}
    <div class="container">
        <a href="#" role="button"
        class={event.data().routes.map(x=>x.id).includes(route.id)?'route':'route faded'}
        style="background-image:repeating-linear-gradient({background},{background2 || background}, {background}); color: {text}"
        on:click={()=>{if(add)addRoute(route, event)}}>
            {route.grade}
        </a>
        {#if del && event.data().routes.map(x=>x.id).includes(route.id)}
            <a href="#" on:click={()=>delRoute(route, event)}>🗑️</a>
        {/if}
    </div>
{:else}
    <div>Pas de voie à afficher.</div>
{/if}

<style>
    .route{
        padding: 15px;
        border: none;
        font-weight: bold;
        max-width: 300px;
        min-width: 100px;
    }

    .faded{
        opacity: 0.3;
    }
    .faded:hover{
        opacity: 1;
    }
</style>