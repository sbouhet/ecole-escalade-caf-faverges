<script>
     export let context //just to hide warning in console
    import {subscription} from '$utils/stores'
    import { getAuth } from "firebase/auth"
    const user = getAuth().currentUser
    
</script>

<h1>Mon compte</h1>

{user.email}
<a href="/">Accueil</a>

<slot></slot> <!-- prevent warnings in console -->
