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
    import HelloAsso from '$components/HelloAsso.svelte'
    import Licence from '$components/Licence.svelte'
    import { doc, onSnapshot } from "firebase/firestore";
    import { db } from "$utils/firebase/firebase"
    import { getAgeGroupFromDayUrl } from '$utils/ageGroups'

    let urlId = $params.id
    let student, medicalCertificateLink, medicalCertificateTimestamp, medicalCertificateStatus, firstName, lastName, paymentStatus, slug
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
    $:if(student && student.private &&student.public){
        medicalCertificateLink = student.private.medicalCertificateLink
        medicalCertificateTimestamp = student.private.medicalCertificateTimestamp
        medicalCertificateStatus = student.public.seasons[$currentSeason.name].medicalCertificate
        paymentStatus = student.public.seasons[$currentSeason.name].payment
        firstName = student.public.firstName
        lastName = student.public.lastName
        slug = getAgeGroupFromDayUrl(student.public.seasons[$currentSeason.name].day, $currentSeason.days, $currentSeason.ageGroups).slug
    }

    
</script>

{#if student}
    <article>
        <hgroup>
            <h1>{printName(student.public)}</h1>
            <h4>{translateStatus(student.public.seasons[$currentSeason.name].status)}</h4>
        </hgroup>
        <small>Cliquez sur chaque étape pour plus de détails.</small>
        <br><br>
        
        <details>
            <summary><Boolean value={'yes'} big={true}/>Étape 1 : Créer un compte sur le site de l'école d'escalade</summary>
            <p style="color:green">Votre compte a bien été créé !</p>
        </details>
        <HelloAsso {student}/>
        <Licence {student}/>
        <MedicalCertificate link={medicalCertificateLink} timestamp={medicalCertificateTimestamp} status={medicalCertificateStatus} studentId={urlId}/>
    </article>
{/if}
<slot></slot>

<style>
    summary{
        font-weight: bold;
    }
   
</style>