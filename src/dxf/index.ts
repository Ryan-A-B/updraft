import { List } from "immutable"
import { GroupCodeAndValue } from "./GroupCodeAndValueGenerator"

export interface State {
    expectSectionName: boolean
    section: Section | null
    variableName: string | null
    extents: {
        minimum: Point
        maximum: Point
    }
    entity: Entity | null
    partialPolyline: PartialPolyline
    polylines: List<Polyline>
}

interface Section {
    name: string
    reducer: Reducer
    finalise: (state: State) => State
}

interface Entity {
    name: string
    reducer: Reducer
}

interface PartialPolyline extends Partial<Polyline> {
    expectedNumberOfVertices?: number
    points: List<Point>
}

const InitialPartialPolyline: PartialPolyline = {
    points: List(),
}

export const InitialState: State = {
    expectSectionName: false,
    section: null,
    variableName: null,
    extents: {
        minimum: { x: 0, y: 0 },
        maximum: { x: 0, y: 0 },
    },
    entity: null,
    partialPolyline: InitialPartialPolyline,
    polylines: List(),
}

export interface Polyline {
    handle: string
    layerName: string
    elevation: number
    points: List<Point>
}

export interface Point {
    x: number
    y: number
}

type Reducer = (state: State, { groupCode, value }: GroupCodeAndValue) => State

function finalisePolyline(partialPolyline: PartialPolyline): Polyline {
    const points = throwIfUndefined(partialPolyline.points)
    if (partialPolyline.expectedNumberOfVertices !== undefined && points.size !== partialPolyline.expectedNumberOfVertices)
        throw new Error("wrong number of vertices for LWPOLYLINE")
    return {
        handle: throwIfUndefined(partialPolyline.handle),
        layerName: throwIfUndefined(partialPolyline.layerName),
        elevation: throwIfUndefined(partialPolyline.elevation),
        points,
    }
}

function throwIfUndefined<T>(value: T | undefined): T {
    if (value === undefined) throw new Error("expected value to be defined")
    return value
}

const sectionByName: { [sectionName: string]: Section } = {
    "HEADER": {
        name: "HEADER",
        reducer: (state, { groupCode, value }) => {
            if (groupCode === 9) {
                return {
                    ...state,
                    variableName: value,
                }
            }
            switch (state.variableName) {
                case "$EXTMIN":
                    if (groupCode === 10) {
                        return {
                            ...state,
                            extents: {
                                ...state.extents,
                                minimum: {
                                    ...state.extents.minimum,
                                    x: Number(value),
                                }
                            }
                        }
                    } else if (groupCode === 20) {
                        return {
                            ...state,
                            extents: {
                                ...state.extents,
                                minimum: {
                                    ...state.extents.minimum,
                                    y: Number(value),
                                }
                            }
                        }
                    }
                    return state
                case "$EXTMAX":
                    if (groupCode === 10) {
                        return {
                            ...state,
                            extents: {
                                ...state.extents,
                                maximum: {
                                    ...state.extents.maximum,
                                    x: Number(value),
                                }
                            }
                        }
                    } else if (groupCode === 20) {
                        return {
                            ...state,
                            extents: {
                                ...state.extents,
                                maximum: {
                                    ...state.extents.maximum,
                                    y: Number(value),
                                }
                            }
                        }
                    }
                    return state
            }
            return state
        },
        finalise: (state) => state
    },
    "ENTITIES": {
        name: "ENTITIES",
        reducer: (state, { groupCode, value }) => {
            if (state.entity === null) {
                if (groupCode !== 0) throw new Error("expected group code 0")
                return {
                    ...state,
                    entity: reducerByEntityName[value] || DefaultSection(value)
                }
            }
            if (groupCode === 0) {
                let { partialPolyline, polylines } = state
                if (state.entity.name === "LWPOLYLINE") {
                    polylines = polylines.push(finalisePolyline(partialPolyline))
                    partialPolyline = InitialPartialPolyline
                }
                return {
                    ...state,
                    partialPolyline,
                    polylines,
                    entity: reducerByEntityName[value] || DefaultSection(value)
                }
            }
            return state.entity.reducer(state, { groupCode, value })
        },
        finalise: (state) => {
            if (state.entity === null) return state
            let { partialPolyline, polylines } = state
            if (state.entity.name === "LWPOLYLINE") {
                polylines = polylines.push(finalisePolyline(partialPolyline))
                partialPolyline = InitialPartialPolyline
            }
            return {
                ...state,
                partialPolyline,
                polylines,
                entity: null
            }
        }
    }
}

const reducerByEntityName: { [entityName: string]: Section } = {
    "LWPOLYLINE": {
        name: "LWPOLYLINE",
        reducer: (state, { groupCode, value }) => {
            switch (groupCode) {
                case 5: // Entity handle; text string of up to 16 hexadecimal digits (fixed)
                    return {
                        ...state,
                        partialPolyline: {
                            ...state.partialPolyline,
                            handle: value,
                        }
                    }
                case 8: // Layer name (fixed)
                    return {
                        ...state,
                        partialPolyline: {
                            ...state.partialPolyline,
                            layerName: value,
                        }
                    }
                case 10: // DXF: X value of the primary point
                    return {
                        ...state,
                        partialPolyline: {
                            ...state.partialPolyline,
                            points: state.partialPolyline.points.push({ x: Number(value), y: 0 }),
                        }
                    }
                case 20: // DXF: Y value of the primary point
                    const point = throwIfUndefined(state.partialPolyline.points.last())
                    return {
                        ...state,
                        partialPolyline: {
                            ...state.partialPolyline,
                            points: state.partialPolyline.points.set(-1, {
                                ...point,
                                y: Number(value),
                            }),
                        }
                    }
                case 38: // DXF: entity's elevation if nonzero
                    return {
                        ...state,
                        partialPolyline: {
                            ...state.partialPolyline,
                            elevation: Number(value),
                        }
                    }
                case 70:
                    // Polyline flag (bit-coded); default is 0:
                    // 1 = Closed; 128 = Plinegen
                    return state
                case 90: // number of vertices
                    return {
                        ...state,
                        partialPolyline: {
                            ...state.partialPolyline,
                            expectedNumberOfVertices: Number(value),
                        }
                    }
                case 100:
                    // Subclass data marker (with derived class name as a string). Required for all objects and entity
                    // classes that are derived from another concrete class. The subclass data marker segregates data
                    // defined by different classes in the inheritance chain for the same object.
                    // This is in addition to the requirement for DXF names for each distinct concrete class derived
                    // from ObjectARX (see Subclass Markers on page 243)
                    return state
            }
            return state
        },
        finalise: (state) => state
    }
}

const DefaultSection = (name: string): Section => {
    return {
        name,
        reducer: (state, groupCodeAndValue) => state,
        finalise: (state) => state,
    }
}

const reducer: Reducer = (state: State, { groupCode, value }: GroupCodeAndValue): State => {
    if (state.expectSectionName) {
        if (groupCode !== 2) throw new Error("expected group code 2")
        return {
            ...state,
            expectSectionName: false,
            section: sectionByName[value] || DefaultSection(value),
        }
    }
    if (state.section !== null) {
        if (groupCode === 0) {
            switch (value) {
                case "SECTION":
                    throw new Error("unexpected SECTION")
                case "ENDSEC":
                    return {
                        ...state.section.finalise(state),
                        section: null,
                    }
            }
        }
        return state.section.reducer(state, { groupCode, value })
    }
    if (groupCode !== 0) throw new Error(`expected group code 0, got ${groupCode}`)
    if (!["SECTION", "EOF"].includes(value)) throw new Error(`expected SECTION or EOF got ${value}`)
    return {
        ...state,
        expectSectionName: true,
    }
}

export default reducer