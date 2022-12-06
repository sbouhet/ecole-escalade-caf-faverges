<script>
    import { COLORS } from '../colors'
    export let route
    let background, background2, text

    $:if (route) {
        background = COLORS.filter(x=>x.name==route.color)[0].background
        background2 = COLORS.filter(x=>x.name==route.color)[0].background2
        text = COLORS.filter(x=>x.name==route.color)[0].text
    }
</script>

{#if route}
    <div class="container">
        <button class="route" style="background-image:repeating-linear-gradient({background},{background2 || background}, {background}); color: {text}">
            {route.grade}
        </button>
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
    }
</style>