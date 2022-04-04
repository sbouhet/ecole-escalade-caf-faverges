<script>
     export let context //just to hide warning in console
    import {currentUser, subscription} from '$utils/stores'
    const user = $currentUser
    $subscription.status = null
</script>

<h1>Mon compte</h1>

{user.email}
<a href="/">Accueil</a>

<slot></slot> <!-- prevent warnings in console -->
