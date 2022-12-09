
<!-- routify:meta reset -->

<div id="container">
    <div id="main">

        <slot></slot>
    </div>
</div>

<style>
    #container{
        display: flex;
        justify-content: center;
        padding-top: 50px;
    }

    #main{
        flex-direction: column;
        display: flex;
        justify-content: center;
        border: 0px solid black;
        
    }

</style>