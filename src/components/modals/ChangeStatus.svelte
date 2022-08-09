<script>
    import { printName } from '$utils/printName'
    import {currentSeason} from '$utils/stores'
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import { translate } from '$utils/TRANSLATE'
    import {capitalize} from '$utils/capitalize'
    import { _updateDoc } from '$utils/firebase/firestore/basics';
    import { changeState } from '$utils/firebase/firestore/changeState';
    export let student, open
    const FIELDS = ['payment', 'medicalCertificate', 'licence']
</script>


<dialog {open}>
    <article>
        <hgroup>
            <h3>{printName(student.public)}</h3>
            <h5>{$currentSeason.name}</h5>
        </hgroup>
        {#each FIELDS as field}
            <strong> {capitalize(translate(field))}</strong> : <Boolean value={student.public.seasons[$currentSeason.name][field]} big={true}/>
            <div class="container">
                <button class={student.public.seasons[$currentSeason.name][field]==='no'?'selected':'outline'}
                on:click={()=>changeState(student.id, field, 'no', $currentSeason.name)}>
                    <Boolean value=no big={true} noTooltip={true}/>
                </button>
                <button class={student.public.seasons[$currentSeason.name][field]==='waiting'?'selected':'outline'}
                on:click={()=>changeState(student.id, field, 'waiting', $currentSeason.name)}>
                    <Boolean value=waiting big={true} noTooltip={true}/>
                </button>
                <button class={student.public.seasons[$currentSeason.name][field]==='yes'?'selected':'outline'}
                on:click={()=>changeState(student.id, field, 'yes', $currentSeason.name)}>
                    <Boolean value=yes big={true} noTooltip={true}/>
                </button>
            </div>
        {/each}
        <footer>
            <a href='#' on:click={()=>open=false} role="button">Fermer</a>
        </footer>
    </article>
</dialog>

<style>
    .container{
        display:flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 50px;
        margin-left: 0;
        max-width: 170px;
    }

    .container button{
        width: 50px;
        height: 50px;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;

    }

    .selected{
        background-color: #1095c157;
    }

</style>