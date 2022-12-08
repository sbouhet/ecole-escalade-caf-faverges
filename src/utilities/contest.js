import {removeDuplicates} from '$utils/removeDuplicates'

export const routePoints = (routeId, event, maxPoints)=>{
    const releventRuns = event.data().runs.filter(x=>x.route==routeId)
    if(releventRuns.length===0) return 0
    return maxPoints/(releventRuns.length)
}

export const routePotential = (routeId, event, maxPoints)=>{
    const releventRuns = event.data().runs.filter(x=>x.route==routeId)
    if(releventRuns.length===0) return maxPoints
    return maxPoints/(releventRuns.length+1)
}

export const routeSends = (routeId, event)=>{
    if (!event.data().runs) return 0
    const releventRuns = event.data().runs.filter(x=>x.route==routeId)
    return releventRuns.length
}

export const studentPoints = (studentId, event, maxPoints)=>{
    let points = 0
    if (!event.data().runs) return 0
    const releventRuns = event.data().runs.filter(x=>x.student===studentId)
    for (const run of releventRuns) {
        points += routePoints(run.route, event, maxPoints)
    }
    return points
}

export const studentsWithPoints = (event, catIndex, maxPoints)=>{
    const releventPax = event.data().participants.filter(x=>x.categorie==catIndex)
    for (const pax of releventPax) {
        pax.points = studentPoints(pax.id, event, maxPoints)
    }
    releventPax.sort(function(a, b) {return b.points - a.points})
    return releventPax
}

export const nbOfRuns = (event, studentId) =>{
    if (!event.data().runs) return 0
    const releventRuns = event.data().runs.filter(x=>x.student === studentId)
    return releventRuns.length
}

export const pointsWithStudents = (event, catIndex, maxPoints)=>{
    const students = studentsWithPoints(event, catIndex, maxPoints)
    let points = students.map(x=>x.points)
    points = removeDuplicates(points)
    points.sort(function(a, b) {return b - a})
    let result = []
    for (const point of points) {
            result.push({
                points:point,
                students: students.filter(x=>x.points == point),
        })
    }
    return result
}
