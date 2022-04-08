<script>
    export let context
    import {params} from '@roxi/routify'
    import { getStudent } from '$utils/firestore'
    import { printName } from '$utils/printName'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import { currentSeason } from '$utils/stores'
    import { translateRole } from '$utils/translateRole'
    import Boolean from '$components/Boolean.svelte'
    let urlId = $params.id
    const student = getStudent(urlId)
</script>

{#await student}
    Recherche de l'Inscription, merci de patienter...
{:then student}
    <article>
        <hgroup>
            <h1>{printName(student.public)}</h1>
            <h4>{student.public.seasons[$currentSeason.name].status}</h4>
        </hgroup>
        
        <details>
            <summary><Boolean value={true} big={true}/>Étape 1 : Créer un compte sur le site de l'école d'escalade</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
        <details>
            <summary><Boolean value={student.public.seasons[$currentSeason.name].payment} big={true}/>Étape 2 : Éffectuer le paiment en ligne pour les cours.</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
        <details>
            <summary><Boolean value={student.public.seasons[$currentSeason.name].licence} big={true}/>Étape 3 : Prendre une licence au CAF de Faverges</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
        <details>
            <summary><Boolean value={student.public.seasons[$currentSeason.name].medicalCertificate} big={true}/>Étape 4 : Transférer un certificat médical</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
    </article>
{:catch error}
    <ErrorMessage {error} />
{/await}

<slot></slot>

<style>
    summary{
        font-weight: bold;
    }
   
</style>