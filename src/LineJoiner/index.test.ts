import { List } from "immutable"
import { LinkedPoint, make, push } from "./LinkedPoints"
import { getDistance, getLineFromPoints, joinLines, Line, getHead, getTail, getPointsFromLine } from "./index"
import { Point } from "../dxf"

describe("join lines", () => {
    test("no lines", () => {
        const lines = List<Line>()

        const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
        expect(joinedLines.size).toBe(0)
    })
    describe("one line", () => {
        test("ends far apart", () => {
            const head = make({ x: 0, y: 0 })
            const middle = make({ x: 0, y: 5 })
            const tail = make({ x: 0, y: 10 })
            push(head, middle)
            push(middle, tail)

            const lines = List<Line>([
                [head, tail]
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(head)
            point = point.next as LinkedPoint
            expect(point).toBe(middle)
            point = point.next as LinkedPoint
            expect(point).toBe(tail)
            expect(getTail(line)).toBe(tail)
            expect(point.next).toBeNull()
        })
        test("already circular", () => {
            const head = make({ x: 0, y: 0 })
            const middle = make({ x: 1, y: 1 })
            const tail = make({ x: 0, y: 2 })
            push(head, middle)
            push(middle, tail)
            push(tail, head)

            const lines = List<Line>([
                [head, tail]
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 5 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(head)
            point = point.next as LinkedPoint
            expect(point).toBe(middle)
            point = point.next as LinkedPoint
            expect(point).toBe(tail)
            expect(getTail(line)).toBe(tail)
            expect(point.next).toBe(head)
        })
        test("becoming circular", () => {
            const head = make({ x: 0, y: 0 })
            const middle = make({ x: 1, y: 1 })
            const tail = make({ x: 0, y: 2 })
            push(head, middle)
            push(middle, tail)

            const lines = List<Line>([
                [head, tail]
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 5 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(head)
            point = point.next as LinkedPoint
            expect(point).toBe(middle)
            point = point.next as LinkedPoint
            expect(point).toBe(tail)
            expect(getTail(line)).toBe(tail)
            expect(point.next).toBe(head)
        })
    })
    describe("two lines", () => {
        test("line[0].tail -> line[1].head", () => {
            const head0 = make({ x: 0, y: 0 })
            const middle0 = make({ x: 0, y: 1 })
            const tail0 = make({ x: 0, y: 2 })
            push(head0, middle0)
            push(middle0, tail0)

            const head1 = make({ x: 0, y: 3 })
            const middle1 = make({ x: 0, y: 4 })
            const tail1 = make({ x: 0, y: 5 })
            push(head1, middle1)
            push(middle1, tail1)

            const lines = List<Line>([
                [head0, tail0],
                [head1, tail1],
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(head0)
            point = point.next as LinkedPoint
            expect(point).toBe(middle0)
            point = point.next as LinkedPoint
            expect(point).toBe(tail0)
            point = point.next as LinkedPoint
            expect(point).toBe(head1)
            point = point.next as LinkedPoint
            expect(point).toBe(middle1)
            point = point.next as LinkedPoint
            expect(point).toBe(tail1)
            expect(getTail(line)).toBe(tail1)
            expect(point.next).toBeNull()
        })
        test("line[0].head -> line[1].tail", () => {
            const head0 = make({ x: 0, y: 2 })
            const middle0 = make({ x: 0, y: 1 })
            const tail0 = make({ x: 0, y: 0 })
            push(head0, middle0)
            push(middle0, tail0)

            const head1 = make({ x: 0, y: 5 })
            const middle1 = make({ x: 0, y: 4 })
            const tail1 = make({ x: 0, y: 3 })
            push(head1, middle1)
            push(middle1, tail1)

            const lines = List<Line>([
                [head0, tail0],
                [head1, tail1],
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(tail0)
            point = point.next as LinkedPoint
            expect(point).toBe(middle0)
            point = point.next as LinkedPoint
            expect(point).toBe(head0)
            point = point.next as LinkedPoint
            expect(point).toBe(tail1)
            point = point.next as LinkedPoint
            expect(point).toBe(middle1)
            point = point.next as LinkedPoint
            expect(point).toBe(head1)
            expect(getTail(line)).toBe(head1)
            expect(point.next).toBeNull()
        })
        test("line[0].head -> line[1].head", () => {
            const head0 = make({ x: 0, y: 2 })
            const middle0 = make({ x: 0, y: 1 })
            const tail0 = make({ x: 0, y: 0 })
            push(head0, middle0)
            push(middle0, tail0)

            const head1 = make({ x: 0, y: 3 })
            const middle1 = make({ x: 0, y: 4 })
            const tail1 = make({ x: 0, y: 5 })
            push(head1, middle1)
            push(middle1, tail1)

            const lines = List<Line>([
                [head0, tail0],
                [head1, tail1],
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(tail0)
            point = point.next as LinkedPoint
            expect(point).toBe(middle0)
            point = point.next as LinkedPoint
            expect(point).toBe(head0)
            point = point.next as LinkedPoint
            expect(point).toBe(head1)
            point = point.next as LinkedPoint
            expect(point).toBe(middle1)
            point = point.next as LinkedPoint
            expect(point).toBe(tail1)
            expect(getTail(line)).toBe(tail1)
            expect(point.next).toBeNull()
        })
        test("line[0].tail -> line[1].tail", () => {
            const head0 = make({ x: 0, y: 0 })
            const middle0 = make({ x: 0, y: 1 })
            const tail0 = make({ x: 0, y: 2 })
            push(head0, middle0)
            push(middle0, tail0)

            const head1 = make({ x: 0, y: 5 })
            const middle1 = make({ x: 0, y: 4 })
            const tail1 = make({ x: 0, y: 3 })
            push(head1, middle1)
            push(middle1, tail1)

            const lines = List<Line>([
                [head0, tail0],
                [head1, tail1],
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(head0)
            point = point.next as LinkedPoint
            expect(point).toBe(middle0)
            point = point.next as LinkedPoint
            expect(point).toBe(tail0)
            point = point.next as LinkedPoint
            expect(point).toBe(tail1)
            point = point.next as LinkedPoint
            expect(point).toBe(middle1)
            point = point.next as LinkedPoint
            expect(point).toBe(head1)
            expect(getTail(line)).toBe(head1)
            expect(point.next).toBeNull()
        })
        test("line[0].tail -> line[1].head, line[1].tail -> line[0].head", () => {
            const head0 = make({ x: 0, y: 0 })
            const middle0 = make({ x: 0, y: 1 })
            const tail0 = make({ x: 0, y: 2 })
            push(head0, middle0)
            push(middle0, tail0)

            const head1 = make({ x: 1, y: 2 })
            const middle1 = make({ x: 1, y: 1 })
            const tail1 = make({ x: 1, y: 0 })
            push(head1, middle1)
            push(middle1, tail1)

            const lines = List<Line>([
                [head0, tail0],
                [head1, tail1],
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(tail0)
            point = point.next as LinkedPoint
            expect(point).toBe(middle0)
            point = point.next as LinkedPoint
            expect(point).toBe(head0)
            point = point.next as LinkedPoint
            expect(point).toBe(tail1)
            point = point.next as LinkedPoint
            expect(point).toBe(middle1)
            point = point.next as LinkedPoint
            expect(point).toBe(head1)
            expect(getTail(line)).toBe(head1)
            expect(point.next).toBe(tail0)
        })
        test("already circular", () => {
            const head0 = make({ x: 0, y: 0 })
            const middle0 = make({ x: 0, y: 1 })
            const tail0 = make({ x: 0, y: 2 })
            push(head0, middle0)
            push(middle0, tail0)
            push(tail0, head0)

            const head1 = make({ x: 1, y: 10 })
            const middle1 = make({ x: 1, y: 5 })
            const tail1 = make({ x: 1, y: 0 })
            push(head1, middle1)
            push(middle1, tail1)

            const lines = List<Line>([
                [head0, tail0],
                [head1, tail1],
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
            expect(joinedLines.size).toBe(2)
            {
                const line = joinedLines.get(0) as Line
                let point = getHead(line)
                expect(point).toBe(head0)
                point = point.next as LinkedPoint
                expect(point).toBe(middle0)
                point = point.next as LinkedPoint
                expect(point).toBe(tail0)
                expect(getTail(line)).toBe(tail0)
                expect(point.next).toBe(head0)
            }
            {
                const line = joinedLines.get(1) as Line
                let point = getHead(line)
                expect(point).toBe(head1)
                point = point.next as LinkedPoint
                expect(point).toBe(middle1)
                point = point.next as LinkedPoint
                expect(point).toBe(tail1)
                expect(getTail(line)).toBe(tail1)
                expect(point.next).toBeNull()
            }
        })
    })
    describe("three lines", () => {
        test("line[0].tail -> line[1].head, line[1].tail -> line[2].head", () => {
            const head0 = make({ x: 0, y: 0 })
            const middle0 = make({ x: 0, y: 1 })
            const tail0 = make({ x: 0, y: 2 })
            push(head0, middle0)
            push(middle0, tail0)

            const head1 = make({ x: 0, y: 3 })
            const middle1 = make({ x: 0, y: 4 })
            const tail1 = make({ x: 0, y: 5 })
            push(head1, middle1)
            push(middle1, tail1)

            const head2 = make({ x: 0, y: 6 })
            const middle2 = make({ x: 0, y: 7 })
            const tail2 = make({ x: 0, y: 8 })
            push(head2, middle2)
            push(middle2, tail2)

            const lines = List<Line>([
                [head0, tail0],
                [head1, tail1],
                [head2, tail2],
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(head0)
            point = point.next as LinkedPoint
            expect(point).toBe(middle0)
            point = point.next as LinkedPoint
            expect(point).toBe(tail0)
            point = point.next as LinkedPoint
            expect(point).toBe(head1)
            point = point.next as LinkedPoint
            expect(point).toBe(middle1)
            point = point.next as LinkedPoint
            expect(point).toBe(tail1)
            point = point.next as LinkedPoint
            expect(point).toBe(head2)
            point = point.next as LinkedPoint
            expect(point).toBe(middle2)
            point = point.next as LinkedPoint
            expect(point).toBe(tail2)
            expect(getTail(line)).toBe(tail2)
            expect(point.next).toBeNull()
        })
        test("line[0].head -> line[1].tail, line[1].head -> line[2].tail", () => {
            const head0 = make({ x: 0, y: 2 })
            const middle0 = make({ x: 0, y: 1 })
            const tail0 = make({ x: 0, y: 0 })
            push(head0, middle0)
            push(middle0, tail0)

            const head1 = make({ x: 0, y: 5 })
            const middle1 = make({ x: 0, y: 4 })
            const tail1 = make({ x: 0, y: 3 })
            push(head1, middle1)
            push(middle1, tail1)

            const head2 = make({ x: 0, y: 8 })
            const middle2 = make({ x: 0, y: 7 })
            const tail2 = make({ x: 0, y: 6 })
            push(head2, middle2)
            push(middle2, tail2)

            const lines = List<Line>([
                [head0, tail0],
                [head1, tail1],
                [head2, tail2],
            ])

            const joinedLines = joinLines({ lines, maximumJoinDistance: 2 })
            expect(joinedLines.size).toBe(1)
            const line = joinedLines.get(0) as Line
            let point = getHead(line)
            expect(point).toBe(tail0)
            point = point.next as LinkedPoint
            expect(point).toBe(middle0)
            point = point.next as LinkedPoint
            expect(point).toBe(head0)
            point = point.next as LinkedPoint
            expect(point).toBe(tail1)
            point = point.next as LinkedPoint
            expect(point).toBe(middle1)
            point = point.next as LinkedPoint
            expect(point).toBe(head1)
            point = point.next as LinkedPoint
            expect(point).toBe(tail2)
            point = point.next as LinkedPoint
            expect(point).toBe(middle2)
            point = point.next as LinkedPoint
            expect(point).toBe(head2)
            expect(getTail(line)).toBe(head2)
            expect(point.next).toBeNull()
        })
    })
})

describe("getLineFromPoints", () => {
    test("one point", () => {
        const x0 = 1000 * Math.random()
        const y0 = 1000 * Math.random()
        const [head, tail] = getLineFromPoints(List([
            { x: x0, y: y0 },
        ]))

        expect(head.x).toBe(x0)
        expect(head.x).toBe(x0)
        expect(head.next).toBeNull()
        expect(head.previous).toBeNull()

        expect(tail.x).toBe(x0)
        expect(tail.x).toBe(x0)
        expect(tail.next).toBeNull()
        expect(tail.previous).toBeNull()
    })

    test("two points", () => {
        const x0 = 1000 * Math.random()
        const y0 = 1000 * Math.random()
        const x1 = 1000 * Math.random()
        const y1 = 1000 * Math.random()
        const [head, tail] = getLineFromPoints(List([
            { x: x0, y: y0 },
            { x: x1, y: y1 },
        ]))

        expect(head.x).toBe(x0)
        expect(head.x).toBe(x0)
        expect(head.next).toBe(tail)
        expect(head.previous).toBeNull()

        expect(tail.x).toBe(x1)
        expect(tail.x).toBe(x1)
        expect(tail.next).toBeNull()
        expect(tail.previous).toBe(head)
    })

    test("circular", () => {
        // TODO
    })
})

describe("getPointsFromLine", () => {
    test("three points", () => {
        const head0 = make({ x: 0, y: 0 })
        const middle0 = make({ x: 0, y: 1 })
        const tail0 = make({ x: 0, y: 2 })
        push(head0, middle0)
        push(middle0, tail0)

        const points = getPointsFromLine(head0)
        expect(points.size).toBe(3)
        expect(points.get(0)).toEqual({ x: 0, y: 0 })
        expect(points.get(1)).toEqual({ x: 0, y: 1 })
        expect(points.get(2)).toEqual({ x: 0, y: 2 })
    })
    test("round trip", () => {
        const expectedPoints = List<Point>().withMutations((points) => {
            const size = Math.random() * 1000
            for (let i = 0; i < size; i++) {
                points.push({
                    x: Math.random() * 1e6,
                    y: Math.random() * 1e6,
                })
            }
        })
        const line = getLineFromPoints(expectedPoints)
        const actualPoints = getPointsFromLine(line[0])
        expectedPoints.forEach((expectedPoint, index) => {
            expect(actualPoints.get(index)).toEqual(expectedPoint)
        })
    })
})

describe("getDistance", () => {
    test("same point", () => {
        expect(getDistance([{ x: 0, y: 0 }, { x: 0, y: 0 }])).toEqual(0)
        expect(getDistance([{ x: -10, y: 0 }, { x: -10, y: 0 }])).toEqual(0)
    })

    test("different x", () => {
        expect(getDistance([{ x: 0, y: 0 }, { x: 1, y: 0 }])).toEqual(1)
        expect(getDistance([{ x: 1, y: 0 }, { x: 0, y: 0 }])).toEqual(1)
    })

    test("different y", () => {
        expect(getDistance([{ x: 0, y: 0 }, { x: 0, y: 1 }])).toEqual(1)
        expect(getDistance([{ x: 0, y: 1 }, { x: 0, y: 0 }])).toEqual(1)
    })

    test("different x and y", () => {
        expect(getDistance([{ x: 0, y: 0 }, { x: 3, y: 4 }])).toEqual(5)
        expect(getDistance([{ x: 9, y: 40 }, { x: 0, y: 0 }])).toEqual(41)
        expect(getDistance([{ x: 0, y: 112 }, { x: 15, y: 0 }])).toEqual(113)
        expect(getDistance([{ x: 20, y: 0 }, { x: 0, y: 21 }])).toEqual(29)

        const x0 = 1000 * Math.random()
        const y0 = 1000 * Math.random()
        expect(getDistance([{ x: x0, y: y0 }, { x: x0 + 24, y: y0 + 143 }])).toBeCloseTo(145, 6)
        expect(getDistance([{ x: x0 + 28, y: y0 }, { x: x0, y: y0 + 195 }])).toBeCloseTo(197, 6)
        expect(getDistance([{ x: x0 + 56, y: y0 + 33 }, { x: x0, y: y0 }])).toBeCloseTo(65, 6)
        expect(getDistance([{ x: x0, y: y0 + 36 }, { x: x0 + 323, y: y0 }])).toBeCloseTo(325, 6)
    })
})
