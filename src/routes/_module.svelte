<script>
    import Back from '../components/Back.svelte'
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import Logout from '../components/Logout.svelte'
    
    let currentUser

    onAuthStateChanged(getAuth(), (usr)=>{
      console.log(usr)
      
      if(usr){
        //usr.getIdTokenResult().then(res => console.log(res.claims))
        usr.getIdTokenResult().then(res => {
          console.log(res)
          currentUser = usr.email
        })
      }else{
          currentUser = null
          console.log('erreur ???')
      }
      
	  })
</script>
<body>
    <div>{currentUser}</div>
    <main class="container">
        <slot></slot>
        <!-- <Back />
        <Logout /> -->
    </main>
</body>

<style>
    div{
        position:absolute;
        top: 0;
        left:0;
    }
</style>