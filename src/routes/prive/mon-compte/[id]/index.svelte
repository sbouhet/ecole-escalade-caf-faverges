<script>
    export let context
    import {params} from '@roxi/routify'
    import { getStudent } from '$firestore/getStudent'
    import { printName } from '$utils/printName'
    import { currentSeason } from '$utils/stores'
    import { translate } from '$utils/TRANSLATE'
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import MedicalCertificate from '$components/subscriptionSteps/MedicalCertificate.svelte'
    import HelloAsso from '$components/subscriptionSteps/HelloAsso.svelte'
    import Licence from '$components/subscriptionSteps/Licence.svelte'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import {capitalize} from '$utils/capitalize'
  

    let error
    let urlId = $params.id
    let student
    const unsub = onSnapshot(doc(db, "students", urlId), async (doc) => {
        try {
            student = await getStudent(urlId)
        } catch (err) {
            error = err
        }
    })
    const unsubPrivate = onSnapshot(doc(db, "students", urlId, "privateCol", "privateDoc"), async (doc) => {
        try {
            student = await getStudent(urlId)
        } catch (err) {
            error = err
        }
    })
</script>
<!-- <ErrorMessage {error} modal={true}/> -->
{#if student}
    {#if student.public.seasons[$currentSeason.name]}
        <article>
            <hgroup>
                <h1>{printName(student.public)}</h1>
                <h4>{translate(student.public.seasons[$currentSeason.name].status)}</h4>
            </hgroup>
            {#if student.public.seasons[$currentSeason.name].payment==="yes" && student.public.seasons[$currentSeason.name].licence==="yes" && student.public.seasons[$currentSeason.name].medicalCertificate==="yes"}
                <strong style="color:green">L'inscription est terminée !</strong><br>
                <div style="color:green">{capitalize(student.public.firstName)} est bien inscrit·e aux cours d'escalade du CAF de Faverges pour la saison {$currentSeason.name}</div>
                <br><br><br>
            {:else}
                <small>Cliquez sur chaque étape pour plus de détails.</small>
                <br><br>
        
                
                <details>
                    <summary role="button" class="outline"><Boolean value={'yes'} big={true}/>Étape 1 : Créer un compte sur le site de l'école d'escalade</summary>
                    <p style="color:green">Votre compte a bien été créé !</p>
                </details>
                <HelloAsso {student} open={$params.payment}/>
                <Licence {student} open={$params.licence}/>
                <MedicalCertificate  {student} open={$params.certificate}/>
            {/if}
        </article>
    {:else}
        <div style="color:red">Erreur : cet élève n'est pas inscrit sur la saison {$currentSeason.name}</div>
    {/if}
{:else}
    <div style="color:red">Erreur : cet élève n'existe pas ou vous n'avez pas les droits pour le voir</div>
{/if}

<slot></slot>
