<script>
    import { onMount } from 'svelte';
    import {COLORS} from '../colors'
    export let scores, test
    const max = Math.max(...scores.map(x=>x.potential))
    let canvas, ctx
    const CANVAS_HEIGHT = window.innerHeight -20
    const CANVAS_WIDTH = window.innerWidth - 50
    const GAP = 20

    function removeDuplicates(arr) {
        return arr.filter((item,index) => arr.indexOf(item) === index);
    }

    $:if(scores && canvas){
        console.log("VALUE CHANGED !");
        ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw()
    }

    const draw = ()=>{
        canvas.width = CANVAS_WIDTH
        canvas.height = CANVAS_HEIGHT
        ctx = canvas.getContext("2d")
        let x = 0
        const originY = CANVAS_HEIGHT-25
        let lines = removeDuplicates(scores.map(x=>x.lineNb));
        lines.sort(function(a, b) {
        return a - b;
        });

        const routeWidth = (CANVAS_WIDTH-GAP*(lines.length-1))/scores.length

        for (const line of lines) {
            const releventRoutes = scores.filter(x=>x.lineNb === line)
            ctx.fillStyle = 'DimGray'
            ctx.fillRect(x, CANVAS_HEIGHT, routeWidth*releventRoutes.length, -20)
            ctx.fillStyle = 'white'
            ctx.textAlign = 'center'
            ctx.font = '15px sans-serif'
            ctx.fillText(line, x+(routeWidth*releventRoutes.length)/2, originY+20)

            for (const route of releventRoutes) {
                ctx.fillStyle = COLORS.filter(x=>x.name===route.color)[0].background
                let routeHeight = -route.potential*(CANVAS_HEIGHT-10)/(max+GAP)-(max-route.potential)/10
                ctx.fillRect(x, originY, routeWidth, routeHeight)
                //contour
                if (["Blanche", "Saumon"].includes(route.color)) {
                    ctx.rect(x, originY, routeWidth, routeHeight)
                }
                //text
                ctx.fillStyle = COLORS.filter(x=>x.name===route.color)[0].text;
                ctx.textAlign = 'center'
                ctx.font = '20px sans-serif'
                ctx.fillText(route.grade, x+routeWidth/2, originY-20)
                ctx.font = '15px sans-serif'
                ctx.fillText(Math.floor(route.potential), x+routeWidth/2, originY+routeHeight+25)
                x += routeWidth
            }
            x+=GAP
        }
        ctx.stroke();
    }

    onMount(() => {
        draw()
    })

    

</script>
{#if scores}
    
{scores[2].potential}
{/if}<br>
{test}
<canvas bind:this={canvas}></canvas>


<style>

    canvas{
        border: 0px solid red;
        margin: 10px;
        background-color: white;

    }


</style>