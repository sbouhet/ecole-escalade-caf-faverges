<script>
    export let context //prevent warnings in console
    import {isActive} from '@roxi/routify'
    import Back from '$components/Back.svelte'
</script>



<slot></slot>



        <Back path='/admin' msg='Retour à la page Admin'/>
