import React from "react"
import { List } from "immutable"

type Point = [number, number]

const polylineStyle: React.CSSProperties = {
    fill: "none",
    stroke: "black",
}

const Editor: React.FunctionComponent = () => {
    const [polylines, setPolylines] = React.useState<List<List<Point>>>(List([
        List([[0, 0], [10, 10], [10, 30], [30, 30]]),
        List([[50, 50], [60, 30], [45, 20], [30, 15], [20, 10]]),
        List([[250, 300], [300, 320], [320, 380], [380, 450], [450, 200]]),
    ]))
    const [foo, setFoo] = React.useState<[number, End] | null>(null)
    const onClick = React.useCallback((index: number, end: End) => {
        console.log(index, end)
        if (foo === null) {
            setFoo([index, end])
            return
        }
        const isSamePoint = foo[0] === index && foo[1] === end
        if (isSamePoint) {
            setFoo(null)
            return
        }
        if (foo[0] === index) {
            const points = polylines.get(index)
            if (points === undefined) throw new Error("points should not be undefined")
            const firstPoint = points.get(0)
            if (firstPoint === undefined) throw new Error("first point should not be undefined")
            setPolylines(polylines.set(index, points.push(firstPoint)))
            setFoo(null)
            return
        }

        let firstPolyline = polylines.get(foo[0])
        if (firstPolyline === undefined) throw new Error("first polyline should be defined")
        let secondPolyline = polylines.get(index)
        if (secondPolyline === undefined) throw new Error("second polyline should be defined")

        if (foo[1] === "first")
            firstPolyline = firstPolyline.reverse()
        if (end === "last")
            secondPolyline = secondPolyline.reverse()

        let indexes = [foo[0], index]
        if (foo[0] < index)
            indexes = [index, foo[0]]

        setPolylines(polylines
            .remove(indexes[0])
            .remove(indexes[1])
            .push(firstPolyline.concat(secondPolyline)))
        setFoo(null)
    }, [polylines, foo])
    return (
        <div className="container">
            <svg height={600} width={800}>
                {polylines.map((polyline, index) => {
                    if (polyline.size === 0) return null
                    return <Polyline points={polyline} index={index} onClick={onClick} />
                })}
            </svg>
        </div>
    )
}

type End = "first" | "last"

interface Props {
    points: List<Point>
    index: number
    onClick: (index: number, end: End) => void
}

const Polyline: React.FunctionComponent<Props> = ({ points, index, onClick }) => {
    const firstPoint = React.useMemo(() => {
        const firstPoint = points.first()
        if (firstPoint === undefined) throw new Error("first point should be defined")
        return firstPoint
    }, [points])
    const pointsString = React.useMemo(() => {
        return points.map((point) => `${point[0]},${point[1]}`).join(" ")
    }, [points])
    const lastPoint = React.useMemo(() => {
        const lastPoint = points.last()
        if (lastPoint === undefined) throw new Error("last point should be defined")
        return lastPoint
    }, [points])
    const onFirstPointClick = React.useCallback(() => {
        onClick(index, "first")
    }, [index, onClick])
    const onLastPointClick = React.useCallback(() => {
        onClick(index, "last")
    }, [index, onClick])
    const closed = React.useMemo(() => {
      return firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1]
    }, [firstPoint, lastPoint])
    return (
        <React.Fragment>
            <polyline points={pointsString} style={polylineStyle} />
            {!closed && (
                <React.Fragment>
                    <circle cx={firstPoint[0]} cy={firstPoint[1]} r={7} onClick={onFirstPointClick} />
                    <circle cx={lastPoint[0]} cy={lastPoint[1]} r={7} onClick={onLastPointClick} />
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default Editor
