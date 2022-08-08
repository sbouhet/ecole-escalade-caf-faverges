<script>
    export let context
    import {params} from '@roxi/routify'
    import { getStudent } from '$firestore/getStudent'
    import { printName } from '$utils/printName'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import { currentSeason, admin } from '$utils/stores'
    import { translate } from '$utils/TRANSLATE'
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import { doc, onSnapshot } from "firebase/firestore";
    import { db } from "$utils/firebase/firebase"
    import { getAgeGroupFromDayUrl } from '$utils/ageGroups'
    import { deleteStudent } from '$firestore/deleteStudent'
    import DisplayObject from '$components/htmlElements/DisplayObject.svelte'
import { _getDoc, _updateDoc } from '$utils/firebase/firestore/basics';

    let student, seasons

    //Listen to changes in student public data
    const unsub = onSnapshot(doc(db, "students", $params.id), async (doc) => {
        student = await getStudent($params.id)
     /*    seasons = []
        for (const name in student.public.seasons) {
            if (Object.hasOwnProperty.call(student.public.seasons, name)) {
                const seasonObject = student.public.seasons[name]
                seasonObject.name = name
                seasons.push(seasonObject)
            }
        } */
    })

    //Listen to changes in student private data
    const unsubPrivate = onSnapshot(doc(db, "students", $params.id, "privateCol", "privateDoc"), async (doc) => {
        student = await getStudent($params.id)
        
    })

    const changePrivateValue = async (key, value="penis")=>{
        await _updateDoc({[key]:value}, "students", $params.id, "privateCol", "privateDoc")
    }
    const changePublicValue = async (key, value="penis")=>{
        await _updateDoc({[key]:value}, "students", $params.id)
    }

    const run = async()=>{
        const array = $params.path.split('[')
        const value = prompt('valeur?')

        //if no array in key string
        if (array.length === 1) {

            //Private
           if (array[0].includes("private")){
                const string = array[0].split('private.')[1]
                console.log(string);
                changePrivateValue(string, value)

            //Public
            }else if (array[0].includes("public")){
                const string = array[0].split('public.')[1]
                console.log(string);
               changePublicValue(string, value)
           }
        //if array in key string
        } else {
             //Private
           if (array[0].includes("private")){
                const string = array[0].split('private.')[1]
                const array2 = array[1].split('].')
                const index = parseInt(array2[0])
                const key2 = array2[1]
                console.log(string);
                console.log(index, key2);
                const doc = await _getDoc("students", $params.id, 'privateCol', 'privateDoc')
                const privateArray = doc.data()[string]
                const element = privateArray[index]
                if (key2) {
                    element[key2] = value
                }else{
                    privateArray[index] = value
                }
                changePrivateValue(string, privateArray)

            //Public
            }else if (array[0].includes("public")){
                const string = array[0].split('public.')[1]
                const array2 = array[1].split('].')
                const index = parseInt(array2[0])
                const key2 = array2[1]
                console.log(string);
                console.log(index, key2);
                const doc = await _getDoc("students", $params.id)
                const publicArray = doc.data()[string]
                const element = publicArray[index]
                if (key2) {
                    element[key2] = value
                }else{
                    publicArray[index] = value
                }
                changePublicValue(string, publicArray)
           }
        }

    }

    $:if($params.path){
      run()
    }


</script>

<!-- {#if $params.path && student && student.public && student.private}
    <dialog open>
        <article>

            <h3>Modifier la valeur</h3>
            {$params.path}
            
            <footer>
                <a href={`./${$params.id}`} role="button">Fermer</a>
            </footer>
        </article>
    </dialog>
{/if} -->


{#if student && student.public && student.private}
    <hgroup>
        <h1>{printName(student.public)}</h1>
        <h5>{student.id}</h5>
    </hgroup>
    <br><br>
    {#if $admin}
        <a href="#" role="button" class="danger" on:click={()=>deleteStudent(student.id)}>Supprimer</a>
    {:else}
        <a href="#" role="button" class="danger" disabled>Supprimer</a>
    {/if}
    <a href={`/prive/mod/sendEmail?id=${student.id}`} role="button">Envoyer un email</a>
    <br><br>
    <hr>
    <br>
    <h3>Base de données</h3>
    <DisplayObject object={student} origin='student' studentId={student.id}/>

{/if}


<slot></slot>

<style>
    .danger{
        background-color: rgb(224, 39, 39);
        border: 0;
    }
</style>

<!-- 
{#if student && student.private && false}
  
    <hgroup>
        <h1>{printName(student.public)}</h1>
        <h5>{student.id}</h5>
    </hgroup>
    <br><br>

    <h3>Public</h3>

  {#each seasons as season}
    <details>
        <summary>{season.name}</summary>
        <div>day : {season.day}</div>
        <div>timestamp : {season.timestamp}</div>
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
        <div>medicalCertificateLink : 
            {#if student.private.medicalCertificateLink}
                <a href="{student.private.medicalCertificateLink}" target="_new">Cliquer ici</a>
            {/if}
        </div>
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
    -->