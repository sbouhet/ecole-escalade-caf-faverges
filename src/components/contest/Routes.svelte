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
    import RouteMenu from '$components/contest/RouteMenu.svelte'
    export let routes, selectedRoute, menuSettings, event, showCategories

    export const removeDuplicates = (array)=>{
        array = array.filter(
            (value, index, self) => index === self.findIndex(
                (t) => (t.lineNb === value.lineNb)
                )
            )
        return array
    }
    const lines = removeDuplicates(routes).map(x=>{return {nb:x.lineNb, txt:x.lineTxt}})
    lines.sort((a, b) => {return a.nb - b.nb})

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

<ul>
    {#each lines as line}
        <li>
            <h4>
                {line.txt}
                <small>(Ligne {line.nb})</small>
            </h4>
            <ul>
                {#each routes.filter(x=>x.lineNb==line.nb).sort(compare)  as route}
                    <li>
                        <Route {route} bind:selectedRoute={selectedRoute}
                        faded={event && !event.data().routes.map(x=>x.id).includes(route.id)}/>

                        {#if (selectedRoute == route && menuSettings) || showCategories}
                            <RouteMenu {route} {menuSettings} {event}/>
                        {/if}
                    </li>
                {/each}
            </ul>
        </li>
    {/each}
</ul>


<style>
    ul li{
        list-style: none;
    }
    ul{
        padding: 0;
    }

    h4{
        margin-bottom:15px;
        margin-top:30px;
    }

    .menu{
        background-color: aqua;
    }
</style>