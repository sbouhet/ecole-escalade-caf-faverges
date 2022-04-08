<script>
    export let context //prevent warnings in console
    import { admin } from '$utils/stores'
    import Back from '$components/Back.svelte'
    import { goto } from '@roxi/routify'

    if(!$admin) $goto('/')
</script>


<slot></slot>

<Back path='/admin' msg='Retour à la page Admin'/>
