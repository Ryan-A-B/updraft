import React from "react"
import { Set, List } from "immutable"
import { v4 as uuid } from "uuid"
import reducer, { InitialState, Point, Polyline, State } from "../dxf"
import GroupCodeAndValueGenerator from "../dxf/GroupCodeAndValueGenerator"
import LineGenerator from "../LineGenerator"
import RangeInput from "../Input/RangeInput"
import { getLineFromPoints, getPointsFromLine, joinLines } from "../LineJoiner"

const parse = async (blob: Blob) => {
    const lines = LineGenerator(blob)
    const groupCodeAndValues = GroupCodeAndValueGenerator(lines)
    let state = InitialState
    for await (let groupCodeAndValue of groupCodeAndValues) {
        state = reducer(state, groupCodeAndValue)
    }
    return state

    // const lines = LineGenerator(blob)
    // let section: string | null = null
    // let variable: string | null = null
    // const headers: { [key: string]: any } = {}
    // for await (let line of lines) {
    //     const groupCode = Number(line)
    //     let value = (await lines.next()).value
    //     if (groupCode === 0 && value === "SECTION") {
    //         section = null
    //         continue
    //     }
    //     if (section === null) {
    //         if (groupCode !== 2)
    //             throw new Error("expected next section")
    //         section = value
    //         console.log(section)
    //         continue
    //     }
    //     if (section === "HEADER") {
    //         switch (groupCode) {
    //             case 0:
    //                 if (value === "ENDSEC")
    //                     console.log(headers)
    //                 continue
    //             case 1: // primary text value
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = value
    //                 continue
    //             case 2: // Name (attribute tag, block name, and so on)
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = value
    //                 continue
    //             case 3: // other text or name values
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = value
    //                 continue
    //             case 5: // Entity handle; text string of up to 16 hexadecimal digits (fixed)
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = value
    //                 continue
    //             case 6: // Linetype name (fixed)
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = value
    //                 continue
    //             case 7: // text style name (fixed)
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = value
    //                 continue
    //             case 8: // Layer name (fixed)
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = value
    //                 continue
    //             case 9: // DXF variable name identifier
    //                 variable = value
    //                 continue
    //             case 10:
    //                 // Primary point; this is the start point of a line or text entity, center of a circle, and so on
    //                 // DXF: X value of the primary point (followed by Y and Z value codes 20 and 30)
    //                 // APP: 3D point (list of three reals)
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 if (headers[variable] === undefined)
    //                     headers[variable] = {}
    //                 headers[variable]['x'] = Number(value)
    //                 continue
    //             case 20: // DXF: Y value of the primary point
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 if (headers[variable] === undefined)
    //                     headers[variable] = {}
    //                 headers[variable]['y'] = Number(value)
    //                 continue
    //             case 30: // DXF: Z value of the primary point
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 if (headers[variable] === undefined)
    //                     headers[variable] = {}
    //                 headers[variable]['z'] = Number(value)
    //                 continue
    //             case 40: // Double-precision floating-point values (text height, scale factors, and so on)
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = Number(value)
    //                 continue
    //             case 50: // Angles (output in degrees to DXF files and radians through AutoLISP and ObjectARX applications)
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = Number(value)
    //                 continue
    //             case 62: // Color number (fixed)
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = Number(value)
    //                 continue
    //             case 70: // Integer values, such as repeat counts, flag bits, or modes
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = Number(value)
    //                 continue
    //             case 280: // 16-bit integer value
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = Number(value)
    //                 continue
    //             case 290: // Boolean flag value
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = Boolean(Number(value))
    //                 continue
    //             case 370:
    //                 // Lineweight enum value (AcDb::LineWeight). Stored and moved around as a 16-bit integer.
    //                 // Custom non-entity objects may use the full range, but entity classes only use 371-379 DXF
    //                 // group codes in their representation, because AutoCAD and AutoLISP both always assume a
    //                 // 370 group code is the entity's lineweight. This allows 370 to behave like other “common” entity
    //                 // fields
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = Number(value)
    //                 continue
    //             case 380:
    //                 // PlotStyleName type enum (AcDb::PlotStyleNameType). Stored and moved around as a 16-bit
    //                 // integer. Custom non-entity objects may use the full range, but entity classes only use 381-389
    //                 // DXF group codes in their representation, for the same reason as the Lineweight range above
    //                 if (variable === null)
    //                     throw new Error("expected variable to be set")
    //                 headers[variable] = Number(value)
    //                 continue
    //             default:
    //                 throw new Error("unhandled group code")
    //         }
    //     }
    // }
}

const DXFViewer: React.FunctionComponent = () => {
    const [file, setFile] = React.useState<File | null>(null)
    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null) return
        const file = event.target.files.item(0)
        if (file === null) return
        setFile(file)
    }, [setFile])
    const [dxf, setDXF] = React.useState<State | null>(null)
    React.useEffect(() => {
        if (file === null) return
        console.log("parsing dxf")
        parse(file).then((dxf) => {
            console.log("parsing complete", dxf)
            setDXF(dxf)
        }).catch(console.error)
    }, [file])
    console.log(dxf)
    return (
        <div className="container">
            <form>
                <input
                    type="file"
                    accept=".dxf"
                    onChange={onChange}
                    className="form-control"
                />
            </form>
            {dxf !== null && <Viewer polylines={dxf.polylines} extents={dxf.extents} />}
        </div>
    )
}

interface ViewerProps {
    polylines: List<Polyline>
    extents: {
        minimum: Point
        maximum: Point
    }
}

const Viewer: React.FunctionComponent<ViewerProps> = ({ polylines, extents }) => {
    const [showAll, setShowAll] = React.useState(true)
    const toggleShowAll = React.useCallback(() => {
        setShowAll(!showAll)
    }, [showAll, setShowAll])
    const viewbox = React.useMemo(() => {
        const width = extents.maximum.x - extents.minimum.x
        const height = extents.maximum.y - extents.minimum.y
        return `${extents.minimum.x} ${extents.minimum.y} ${width} ${height}`
    }, [extents])
    const elevations = React.useMemo(() => {
        return Set<number>().withMutations((elevations) => {
            polylines.forEach((polyline) => {
                elevations.add(polyline.elevation)
            })
        }).valueSeq().sort()
    }, [polylines])
    const [elevation, setElevation] = React.useState(0)
    const filteredPolylines = React.useMemo(() => {
        if (showAll) return polylines
        return polylines.filter((polyline) => {
            return polyline.elevation === elevation
        })
    }, [showAll, polylines, elevation])
    const [maximumJoinDistance, setMaximumJoinDistance] = React.useState(2)
    const joinedAndFilteredPolylines = React.useMemo(() => {
        if (showAll) return filteredPolylines
        if (maximumJoinDistance === 0) return filteredPolylines
        const lines = filteredPolylines.map((polyline) => {
            return getLineFromPoints(polyline.points)
        })
        const joinedLines = joinLines({ lines, maximumJoinDistance })
        return joinedLines.map((line): Polyline => {
            return {
                handle: uuid(),
                layerName: "0",
                elevation: elevation,
                points: getPointsFromLine(line[0]),
            }
        })
    }, [showAll, filteredPolylines, elevation, maximumJoinDistance])
    return (
        <React.Fragment>
            <div>
                <button onClick={toggleShowAll} className="btn btn-primary">
                    Show All
                </button>
            </div>
            <div>
                <label htmlFor="input-elevation">
                    Elevation: {elevation}
                </label>
                <RangeInput
                    id="input-elevation"
                    min={elevations.first()}
                    max={elevations.last()}
                    step={0.25}
                    value={elevation}
                    onChange={setElevation}
                    className="form-range"
                />
            </div>
            <div>
                <label htmlFor="input-elevation">
                    Maxumum join distance: {maximumJoinDistance}
                </label>
                <RangeInput
                    id="input-maximum_join_distance"
                    min={0}
                    value={maximumJoinDistance}
                    onChange={setMaximumJoinDistance}
                    className="form-range"
                />
            </div>
            {filteredPolylines.size} vs {joinedAndFilteredPolylines.size}
            <svg height={800} viewBox={viewbox}>
                {joinedAndFilteredPolylines.map((polyline) => <SVGPolyline points={polyline.points} key={polyline.handle} />)}
            </svg>
        </React.Fragment >
    )
}

const SVGPolylineStyle: React.CSSProperties = {
    fill: "none",
    stroke: "black",
    strokeWidth: 1,
}

interface SVGPolylineProps {
    points: List<Point>
}

const SVGPolyline: React.FunctionComponent<SVGPolylineProps> = ({ points }) => {
    const pointsString = React.useMemo(() => {
        return points.map((point) => `${point.x},${point.y}`).join(" ")
    }, [points])
    return (
        <polyline points={pointsString} style={SVGPolylineStyle} />
    )
}

export default DXFViewer
