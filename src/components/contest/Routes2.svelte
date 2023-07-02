<script>
    /*
        routes need to have this format:
            {
                color: 'Rose',
                grade: '6a',
                id 'fsdkljfhsdf'
                lineNb: 4,
                lineTxt: 'dièdre'
            }
    */

    import Route from '$components/contest/Route.svelte'
    import Route2 from '$components/contest/Route2.svelte'
    import RouteMenu from '$components/contest/RouteMenu.svelte'
    import RouteCategories from './RouteCategories.svelte';
    export let routes, selectedRoute, event, categories

    function compare( a, b ) {
    if ( a.grade < b.grade ){
        return -1;
    }
    if ( a.grade > b.grade ){
        return 1;
    }
    return 0;
    }

   
</script>



{#each routes.sort(compare)  as route}
    <li>
        <Route2 {route} bind:selectedRoute={selectedRoute} {event} {categories}/>
    </li>
{/each}



<style>
    li{
        list-style: none;
    }
    ul{
        padding: 0;
    }
</style>