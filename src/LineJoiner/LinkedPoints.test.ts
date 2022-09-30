import { LinkedPoint, push, reverse } from "./LinkedPoints"

describe("LinkedPoints", () => {
    describe("push", () => {
        test("one item", () => {
            const x0 = 1000 * Math.random()
            const y0 = 1000 * Math.random()
            const head: LinkedPoint = {
                x: x0,
                y: y0,
                next: null,
                previous: null
            }

            const x1 = 1000 * Math.random()
            const y1 = 1000 * Math.random()
            const tail: LinkedPoint = {
                x: x1,
                y: y1,
                next: null,
                previous: null
            }

            push(head, tail)

            expect(head.x).toBe(x0)
            expect(head.y).toBe(y0)
            expect(head.next).toBe(tail)
            expect(head.previous).toBeNull()

            expect(tail.x).toBe(x1)
            expect(tail.y).toBe(y1)
            expect(tail.next).toBeNull()
            expect(tail.previous).toBe(head)
        })

        test("two items", () => {
            const x0 = 1000 * Math.random()
            const y0 = 1000 * Math.random()
            const head: LinkedPoint = {
                x: x0,
                y: y0,
                next: null,
                previous: null
            }

            const x1 = 1000 * Math.random()
            const y1 = 1000 * Math.random()
            const middle: LinkedPoint = {
                x: x1,
                y: y1,
                next: null,
                previous: null
            }

            const x2 = 1000 * Math.random()
            const y2 = 1000 * Math.random()
            const tail: LinkedPoint = {
                x: x2,
                y: y2,
                next: null,
                previous: null
            }

            push(head, middle)
            push(middle, tail)

            expect(head.x).toBe(x0)
            expect(head.y).toBe(y0)
            expect(head.next).toBe(middle)
            expect(head.previous).toBeNull()

            expect(middle.x).toBe(x1)
            expect(middle.y).toBe(y1)
            expect(middle.next).toBe(tail)
            expect(middle.previous).toBe(head)

            expect(tail.x).toBe(x2)
            expect(tail.y).toBe(y2)
            expect(tail.next).toBeNull()
            expect(tail.previous).toBe(middle)
        })

        test("circular", () => {
            // TODO
        })
    })

    describe("reverse", () => {
        test("one item", () => {
            const x = 1000 * Math.random()
            const y = 1000 * Math.random()
            const head: LinkedPoint = {
                x,
                y,
                next: null,
                previous: null
            }
            reverse(head)

            expect(head.x).toBe(x)
            expect(head.y).toBe(y)
            expect(head.next).toBeNull()
            expect(head.previous).toBeNull()
        })

        test("two items", () => {
            const x0 = 1000 * Math.random()
            const y0 = 1000 * Math.random()
            const head: LinkedPoint = {
                x: x0,
                y: y0,
                next: null,
                previous: null
            }

            const x1 = 1000 * Math.random()
            const y1 = 1000 * Math.random()
            const tail: LinkedPoint = {
                x: x1,
                y: y1,
                next: null,
                previous: null,
            }

            push(head, tail)
            reverse(head)

            expect(head.x).toBe(x0)
            expect(head.y).toBe(y0)
            expect(head.next).toBeNull()
            expect(head.previous).toBe(tail)

            expect(tail.x).toBe(x1)
            expect(tail.y).toBe(y1)
            expect(tail.next).toBe(head)
            expect(tail.previous).toBeNull()
        })

        test("circular", () => {
            // TODO
        })
    })
})