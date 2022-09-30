import { Map, Set, List } from "immutable"
import { Point } from "../dxf"
import { LinkedPoint, make, push, reverse } from "./LinkedPoints"

export type Line = [LinkedPoint, LinkedPoint]
export const getHead = (line: Line) => line[0]
export const getTail = (line: Line) => line[1]

interface JoinLinesInput {
    lines: List<Line>
    maximumJoinDistance: number
}

interface DistanceFrame {
    points: [LinkedPoint, LinkedPoint]
    distance: number
}

export const joinLines = ({ lines, maximumJoinDistance }: JoinLinesInput): List<Line> => {
    if (lines.size === 0) return lines

    let heads = lines.map(([head, tail]) => head).toSet()
    const isHead = (point: LinkedPoint) => heads.contains(point)
    let tails = lines.map(([head, tail]) => tail).toSet()
    const isTail = (point: LinkedPoint) => tails.contains(point)

    let endByEnd = Map<LinkedPoint, LinkedPoint>()
    lines.forEach(([head, tail]) => {
        endByEnd = endByEnd.set(tail, head).set(head, tail)
    })

    const points = lines.flatMap(([head, tail]): LinkedPoint[] => {
        const alreadyCircular = head.previous === tail
        if (alreadyCircular) return []
        return [head, tail]
    })
    const distances = points.flatMap((pointA, index) => {
        return points.slice(index + 1).map((pointB): DistanceFrame => {
            return {
                points: [pointA, pointB],
                distance: getDistance([pointA, pointB]),
            }
        })
    })
    const sortedDistances = distances.sort((valueA, valueB) => {
        return (valueA.distance < valueB.distance ? -1 : 1)
    })

    let usedPoints = Set<LinkedPoint>()
    sortedDistances.forEach(({ points: [pointA, pointB], distance }) => {
        if (distance > maximumJoinDistance) return false
        if (usedPoints.contains(pointA)) return
        if (usedPoints.contains(pointB)) return
        usedPoints = usedPoints.add(pointA).add(pointB)
        const iPointA = endByEnd.get(pointA) as LinkedPoint
        if (iPointA === pointB) {
            let head = pointB
            let tail = pointA
            if (isHead(pointA)) {
                head = pointA
                tail = pointB
            }
            push(tail, head)
            return
        }
        const iPointB = endByEnd.get(pointB) as LinkedPoint

        if (isHead(pointA)) {
            reverse(pointA)
            heads = heads.remove(pointA).add(iPointA)
            tails = tails.remove(iPointA) // .add(pointA)
        }
        if (isTail(pointB)) {
            reverse(iPointB)
            heads = heads.remove(iPointB) // .add(pointB)
            tails = tails.remove(pointB).add(iPointB)
        }

        push(pointA, pointB)
        heads = heads.remove(pointB)
        tails = tails.remove(pointA)

        endByEnd = endByEnd
            .remove(pointA)
            .remove(pointB)
            .set(iPointA, iPointB)
            .set(iPointB, iPointA)
    })

    return heads.toList().map((head): Line => {
        const tail = endByEnd.get(head) as LinkedPoint
        return [head, tail]
    })
}

export const getLineFromPoints = (points: List<Point>): Line => {
    const head: LinkedPoint = make(points.get(0) as Point)
    let tail = head
    points.slice(1).forEach((point) => {
        const newTail = make(point)
        push(tail, newTail)
        tail = newTail
    })
    return [head, tail]
}

export const getPointsFromLine = (head: LinkedPoint): List<Point> => {
    let points = List<Point>()
    points = points.push({
        x: head.x,
        y: head.y,
    })
    for (let point = head.next; point !== null && point !== head; point = point.next) {
        points = points.push({
            x: point.x,
            y: point.y,
        })
    }
    return points
}

export const getDistance = (points: [Point, Point]) => {
    return Math.sqrt(
        Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2)
    )
}