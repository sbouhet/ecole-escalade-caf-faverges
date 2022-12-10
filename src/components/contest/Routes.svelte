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
    export let routes, selectedRoute, menuSettings

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

    $:console.log(selectedRoute);
</script>

<ul>
    {#each lines as line}
        <li>
            <h4>
                {line.txt}
                <small>(Ligne {line.nb})</small>
            </h4>
            <ul>
                {#each routes.filter(x=>x.lineNb==line.nb)  as route}
                    <li>
                        <Route {route} bind:selectedRoute={selectedRoute}/>
                        {#if selectedRoute == route && menuSettings}
                            <RouteMenu {route} {menuSettings} />
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