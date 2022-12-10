<script>
    import { _getDocs } from '$utils/firebase/firestore/basics'
    let  gyms
    const getGyms = async ()=>{
        gyms = await _getDocs('gyms')
    }

    getGyms()
</script>

{#if gyms}
    <h1>Salles</h1>
    <ul>
        {#each gyms as gym}
            <li>
                <a href="./gyms/{gym.id}">{gym.id}</a>
            </li>
        {/each}
    </ul>
{/if}

<a href="./gyms/createGym">Créer une salle</a><br>

<style>
    ul li{
        list-style:none;
    }
</style>