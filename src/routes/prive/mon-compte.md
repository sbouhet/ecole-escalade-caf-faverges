<script>
        export let context //just to hide warning in console

    import {currentUser} from '../../utilities/stores'
    const user = $currentUser
</script>

<h1>Mon compte</h1>

{user.email}
<slot></slot> <!-- prevent warnings in console -->
