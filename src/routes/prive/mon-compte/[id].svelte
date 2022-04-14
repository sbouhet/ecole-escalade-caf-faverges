<script>
    export let context
    import {params} from '@roxi/routify'
    import { getStudent } from '$firestore/getStudent'
    import { printName } from '$utils/printName'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import { currentSeason } from '$utils/stores'
    import { translateRole, translateStatus } from '$utils/TRANSLATE'
    import Boolean from '$components/Boolean.svelte'
    import MedicalCertificate from '$components/MedicalCertificate.svelte'
    import { doc, onSnapshot } from "firebase/firestore";
    import { db } from "$utils/firebase/firebase"

    let urlId = $params.id
    let student, medicalCertificateLink, medicalCertificateTimestamp, medicalCertificateStatus
    const unsub = onSnapshot(doc(db, "students", urlId), async (doc) => {
        student = await getStudent(urlId)
        //console.log("Public document changed")
        //console.log(student)
    })
    const unsubPrivate = onSnapshot(doc(db, "students", urlId, "privateCol", "privateDoc"), async (doc) => {
        student = await getStudent(urlId)
        //console.log("Private document changed")
        //console.log(student)
    })
    $:if(student && student.private){
        medicalCertificateLink = student.private.medicalCertificateLink
        medicalCertificateTimestamp = student.private.medicalCertificateTimestamp
        medicalCertificateStatus = student.public.seasons[$currentSeason.name].medicalCertificate
    }

    
</script>

{#if student}
    <article>
        <hgroup>
            <h1>{printName(student.public)}</h1>
            <h4>{translateStatus(student.public.seasons[$currentSeason.name].status)}</h4>
        </hgroup>
        
        <details>
            <summary><Boolean value={'yes'} big={true}/>Étape 1 : Créer un compte sur le site de l'école d'escalade</summary>
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
        <MedicalCertificate link={medicalCertificateLink} timestamp={medicalCertificateTimestamp} status={medicalCertificateStatus} studentId={urlId}/>
    </article>
{/if}
<slot></slot>

<style>
    summary{
        font-weight: bold;
    }
   
</style>