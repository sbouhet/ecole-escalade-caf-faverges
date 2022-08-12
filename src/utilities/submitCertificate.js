import {uploadMedicalCertificate} from '$utils/firebase/storage'
import { getFunctions, httpsCallable } from "firebase/functions"
import { getApp } from "firebase/app"
import { printName } from './printName'

export const submitCertificate = async(file, seasonName, student, userId) => {
    try {
        const functions = getFunctions(getApp())
        const sendEmailAndChangeStatus = httpsCallable(functions, 'sendEmailAndChangeStatus')

        if(!file) throw "Pas de document"
        if (!file.type) "Il faut preciser le type de document ('doc' ou 'url')"
        let extension
        if (file.type === 'doc') {
            const stringArray = file.doc.name.split('.')
            extension = stringArray[stringArray.length-1].toLowerCase()
        } else {
            extension = 'jpg'
        }
        const name = `${student.public.lastName.toUpperCase()}_${student.public.firstName}.${extension}`
        const link = await uploadMedicalCertificate(file, seasonName, student.id, userId, name)
        console.log(link)
        const response = await sendEmailAndChangeStatus({seasonName:seasonName, id:student.id, name:printName(student.public)})
        console.log(response)
        if(response.data.statusCode!==200) throw new Error(response.data.message)
        console.log("Medical certificate uploaded successfully")
        return {statusCode: 200, link, response}    
    } catch (err) {
        return {statusCode: 409, error: err}
    }
} 