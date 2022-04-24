<script>
    export let context
    import {params} from '@roxi/routify'
    import { getStudent } from '$firestore/getStudent'
    import { printName } from '$utils/printName'
    import ErrorMessage from '$components/ErrorMessage.svelte'
    import { currentSeason } from '$utils/stores'
    import { translateRole, translateStatus } from '$utils/TRANSLATE'
    import Boolean from '$components/Boolean.svelte'
    import { doc, onSnapshot } from "firebase/firestore";
    import { db } from "$utils/firebase/firebase"
    import { getAgeGroupFromDayUrl } from '$utils/ageGroups'

    let urlId = $params.id
    let student, seasons
    const unsub = onSnapshot(doc(db, "students", urlId), async (doc) => {
        student = await getStudent(urlId)
        seasons = []
        for (const name in student.public.seasons) {
            if (Object.hasOwnProperty.call(student.public.seasons, name)) {
                const seasonObject = student.public.seasons[name]
                seasonObject.name = name
                seasons.push(seasonObject)
            }
        }
    })
    const unsubPrivate = onSnapshot(doc(db, "students", urlId, "privateCol", "privateDoc"), async (doc) => {
        student = await getStudent(urlId)
        
    })
    let input
    let field = "public.seasons.2021-2022.day"


    const handleClick = async()=>{
        console.log(input)
    }
</script>

{#if student && student.private}
  
    <hgroup>
        <h1>{printName(student.public)}</h1>
        <h5>{student.public.id}</h5>
    </hgroup>
    <br><br>

    <h3>Public</h3>

  {#each seasons as season}
    <details>
        <summary>{season.name}</summary>
        <div>day : {season.day}</div>
        <div>helloAssoId : {season.helloAssoId}</div>
        <div>licence : {season.licence}</div>
        <div>medicalCertificate : {season.medicalCertificate}</div>
        <div>payment : {season.payment}</div>
        <div>status : {season.status}</div>
    </details>
    {/each}   

    <h3>Private</h3>

      
        <div>receipts : 
            {#if student.private.receipts}    
                {#each student.private.receipts as receipts}
                <div><a href="{receipts}" target="_new">Cliquer ici</a></div>
                {/each}
            {/if}
        </div>
        <div>helloAssoId : {student.private.helloAssoId}</div>
        <div>dateOfBirth : {student.private.dateOfBirth}</div>
        <div>email : {student.private.email}</div>
        <div>tel : {student.private.tel}</div>
        <div>emails : {student.private.emails}</div>
        <div>medicalCertificateLink : <a href="{student.private.medicalCertificateLink}" target="_new">Cliquer ici</a></div>
        <div>medicalCertificateTimestamp : {student.private.medicalCertificateTimestamp}</div>
        <hr>
        <div>parents :
                {#each student.private.parents as parent}
                    <div>firstName : {parent.firstName}</div>
                    <div>lastName : {parent.lastName}</div>
                    <div>tel : {parent.tel}</div>
                    <div>email : {parent.email}</div>
                    <div>role : {parent.role}</div>
                    <hr>
                {/each}
        </div>
       
        

       

{/if}
<slot></slot>

<style>
    summary{
        font-weight: bold;
    }
</style>