import {removeDuplicates} from '$utils/removeDuplicates'

const getLineNb = (event, routeId)=>{
    const route = event.data().routes.filter(x=>x.id===routeId)[0]
    return route.lineNb
}

const catRuns = (event, catIndex)=>{
    if(catIndex==undefined)throw'No catINdex'
    const catStudents = event.data().participants.filter(x=>x.categorie==catIndex)
    const ids = catStudents.map(x=>x.id)
    return event.data().runs.filter(x=>ids.includes(x.student))
}

const releventRuns = (event, routeId, catIndex)=>{
    if(catIndex==undefined)throw'No catINdex'
    const route = event.data().routes.filter(x=>x.id===routeId)[0]
    let runs = []
    if (route.color === "Toutes prises") {
        //all event runs in the categorie
        for (const run of catRuns(event, catIndex)) {
            const lineNb = getLineNb(event, run.route)
            //all runs with same lineNb
            if (lineNb == route.lineNb) {
                //don't add if same student
                if(!runs.map(x=>x.student).includes(run.student)){
                    runs.push(run)
                }
                //runs.push(run)
            }
        }
    } else {
        //all runs from categorie with routeId
        runs = catRuns(event, catIndex).filter(x=>x.route==routeId)
    }
    return runs
}

export const routePoints = (routeId, event, maxPoints, catIndex)=>{
    if(catIndex==undefined)throw'No catINdex for routePoints'
    const runs = releventRuns(event, routeId, catIndex)
    if(runs.length===0) return 0
    return Math.floor(maxPoints/(runs.length))
}

export const routePotential = (routeId, event, maxPoints, catIndex)=>{
    if(catIndex==undefined)throw'No catINdex for routePotential'
    const runs = releventRuns(event, routeId, catIndex)
    if(runs.length===0) return maxPoints
    return Math.floor(maxPoints/(runs.length+1))
}

export const routeSends = (routeId, event, catIndex)=>{
    if(catIndex==undefined)throw'No catINdex for routeSends'
    if (!event.data().runs) return 0
    const releventRuns = catRuns(event, catIndex).filter(x=>x.route==routeId)
    return releventRuns.length
}

export const studentPoints = (studentId, event, maxPoints, catIndex)=>{
    if(catIndex==undefined)throw'No catINdex for studentPoints'
    let points = 0
    if (!event.data().runs) return 0
    const releventRuns = event.data().runs.filter(x=>x.student===studentId)
    for (const run of releventRuns) {
        points += routePoints(run.route, event, maxPoints, catIndex)
    }
    return points
}

export const studentsWithPoints = (event, catIndex, maxPoints)=>{
    const releventPax = event.data().participants.filter(x=>x.categorie==catIndex)
    for (const pax of releventPax) {
        pax.points = studentPoints(pax.id, event, maxPoints, catIndex)
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

export const rank = (student, event) =>{
    const catIndex = student.categorie
    if(catIndex==undefined)throw'No catINdex for rank'
    const points = studentPoints(student.id, event, 1000, catIndex)
    const allPoints = pointsWithStudents(event, student.categorie, 1000)
    const studentIndex = allPoints.map(x=>x.points).indexOf(points)
return {rank:studentIndex+1, otherStudents:allPoints[studentIndex].students}
}

export const gymRouteToEventRoute = (gymRoute, gym)=>{
    if(!gym) throw'no gym'
    return {
        id:gymRoute.id,
        lineNb: gymRoute.data().line,
        lineTxt: gym.data().lines[gymRoute.data().line-1],
        grade: gymRoute.data().grade,
        color: gymRoute.data().color
    }
}