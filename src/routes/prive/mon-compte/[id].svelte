<script>
    export let context
    import {params} from '@roxi/routify'
    import { getStudent } from '$utils/firestore'
    import { printName } from '$utils/printName'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import { currentSeason } from '$utils/stores'
    import { translateRole } from '$utils/translateRole'
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
            <summary><span>✅</span>Étape 1 : Créer un compte sur le site de l'écolde d'escalade</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
        <details>
            <summary><span>❌</span>Étape 2 : Éffectuer le paient en ligne pour les cours.</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
        <details>
            <summary><span>❌</span>Étape 3 : Prendre une licence au CAF de Faverges</summary>
            <p>Si vous êtes ici, c'est que vous avez déjà réussi cette étape. Bravo !</p>
        </details>
        <details>
            <summary><span>❌</span>Étape 4 : Transférer un certificat médical</summary>
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
    span{
        margin-right: 20px;
    }
   
</style>