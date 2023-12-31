import { capitalize } from "$utils/capitalize"
import { BError } from "berror"

export const printName = (obj, studentList) => {
  try {
    if (!obj) throw new BError("No object")
    if (!obj.firstName) throw new BError("No firstName")
    if (!obj.lastName) throw new BError("No lastName")
    let firstName = capitalize(obj.firstName.toLowerCase())
    let lastName = obj.lastName.toUpperCase()
    if (studentList) {
      
      if (studentList.filter(x=>x.firstName === obj.firstName).length > 1) {
        return `${firstName} ${lastName}`
      }else{
        return firstName
      }
    }
    return `${firstName} ${lastName}`
  } catch (err) {
    const e = new BError("$utils/printName => printName()", err)
    e.log
    return "??????"
  }
}
