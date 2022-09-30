import { Point } from "../dxf"

type Optional<T> = T | null

export interface LinkedPoint extends Point {
    next: Optional<LinkedPoint>
    previous: Optional<LinkedPoint>
}

export const make = (point: Point): LinkedPoint => {
    return {
        ...point,
        next: null,
        previous: null,
    }
}

export const push = (nodeA: LinkedPoint, nodeB: LinkedPoint) => {
    nodeA.next = nodeB
    nodeB.previous = nodeA
}

export const reverse = (head: LinkedPoint) => {
    for (let node: Optional<LinkedPoint> = head; node !== null; node = node.previous) {
        const temp: Optional<LinkedPoint> = node.next
        node.next = node.previous
        node.previous = temp
    }
}
