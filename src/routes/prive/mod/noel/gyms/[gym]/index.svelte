<script>
    import { _getDoc, _updateDoc, _addDoc, _getDocs, _deleteDoc } from '$utils/firebase/firestore/basics'
    import Routes from '$components/contest/Routes.svelte'
    import {params} from '@roxi/routify'
    import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
    import { db } from "$utils/firebase/firebase"
    import { gymRouteToEventRoute } from '$utils/contest';
    const gymId = $params.gym
    let gym, routes

    const getGym = async (id)=>{
        gym = await _getDoc('gyms', id)
        const gymRoutes = await _getDocs('gyms', id, 'routes')
        let tmp = []
        for (const gymRoute of gymRoutes) {
            tmp.push(gymRouteToEventRoute(gymRoute, gym))
        }
        routes = tmp
    }
    


    const q = query(collection(db, "gyms", gymId, 'routes'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        getGym(gymId)
    })

</script>


{#if gym && routes}
    <h1>{gym.id}</h1>
    <a href="./{gym.id}/addRoute">Ajouter une voie</a>
    <Routes {routes} menuSettings={{type: 'gym', gymId: gym.id, showDel: true}}/>
{:else}
    Merci de patienter.
{/if}