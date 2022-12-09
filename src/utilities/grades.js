export const gradeToNumber = (grade)=>{
    return GRADES.indexOf(grade)+1
}

export const numberToGrade = (number)=>{
    return GRADES[number-1]
}

export const GRADES = ['TP','4a', '4b', '4c', '5a', '5a+', '5b', '5b+', '5c', '5c+', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c+']
