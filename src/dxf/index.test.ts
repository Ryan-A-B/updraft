import { Blob } from "blob-polyfill"
import reducer, { InitialState } from "."
import LineGenerator from "../LineGenerator"
import GroupCodeAndValueGenerator from "./GroupCodeAndValueGenerator"

const blobs = [
  new Blob(["  0\nSECTION\n  2\nHEADER\n  0\nENDSEC"])
]

test('read pairs', async () => {
  const expectedPairs = [
    { groupCode: 0, value: "SECTION" },
    { groupCode: 2, value: "HEADER" },
    { groupCode: 0, value: "ENDSEC" },
  ]
  let i = 0;
  const lines = LineGenerator(blobs[0])
  const groupCodeAndValues = GroupCodeAndValueGenerator(lines)
  for await (let { groupCode, value } of groupCodeAndValues) {
    expect(groupCode).toEqual(expectedPairs[i].groupCode)
    expect(value).toEqual(expectedPairs[i].value)
    i++
  }
})

describe("reducer", () => {
  test("top level", () => {
    expect(() => {
      reducer(InitialState, {
        groupCode: 2,
        value: "HEADER",
      })
    }).toThrowError("expected group code 0, got 2")
    expect(() => {
      let state = reducer(InitialState, {
        groupCode: 0,
        value: "SECTION",
      })
      reducer(state, {
        groupCode: 10,
        value: "  13",
      })
    }).toThrowError("expected group code 2")
    expect(() => {
      let state = reducer(InitialState, {
        groupCode: 0,
        value: "SECTION",
      })
      state = reducer(state, {
        groupCode: 2,
        value: "HEADER",
      })
      state = reducer(state, {
        groupCode: 0,
        value: "SECTION",
      })
    }).toThrowError("unexpected SECTION")
    expect(() => {
      let state = reducer(InitialState, {
        groupCode: 0,
        value: "SECTION",
      })
      state = reducer(state, {
        groupCode: 2,
        value: "HEADER",
      })
      state = reducer(state, {
        groupCode: 0,
        value: "ENDSEC",
      })
      state = reducer(state, {
        groupCode: 2,
        value: "ENTITIES",
      })
    }).toThrowError("expected group code 0, got 2")
    expect(() => {
      let state = reducer(InitialState, {
        groupCode: 0,
        value: "SECTION",
      })
      state = reducer(state, {
        groupCode: 2,
        value: "HEADER",
      })
      state = reducer(state, {
        groupCode: 0,
        value: "ENDSEC",
      })
      state = reducer(state, {
        groupCode: 2,
        value: "EOF",
      })
    }).not.toThrowError("expected SECTION")
    expect(() => {
      let state = reducer(InitialState, {
        groupCode: 0,
        value: "SECTION",
      })
      state = reducer(state, {
        groupCode: 2,
        value: "HEADER",
      })
      state = reducer(state, {
        groupCode: 0,
        value: "ENDSEC",
      })
      state = reducer(state, {
        groupCode: 0,
        value: "SECTION",
      })
      state = reducer(state, {
        groupCode: 10,
        value: " 13",
      })
    }).toThrowError("expected group code 2")
  })

  test("entities reducer", () => {
    expect(() => {
      let state = reducer(InitialState, {
        groupCode: 0,
        value: "SECTION",
      })
      state = reducer(state, {
        groupCode: 2,
        value: "ENTITIES",
      })
      state = reducer(state, {
        groupCode: 10,
        value: "   13",
      })
    }).toThrowError("expected group code 0")

    expect(() => {
      let state = reducer(InitialState, {
        groupCode: 0,
        value: "SECTION",
      })
      state = reducer(state, {
        groupCode: 2,
        value: "ENTITIES",
      })
      state = reducer(state, {
        groupCode: 0,
        value: "LWPOLYLINE",
      })
      state = reducer(state, {
        groupCode: 100,
        value: 'AcDbEntity',
      })
      state = reducer(state, {
        groupCode: 8,
        value: '0',
      })
      state = reducer(state, {
        groupCode: 100,
        value: 'AcDbPolyline',
      })
      state = reducer(state, {
        groupCode: 70,
        value: '0',
      })
      state = reducer(state, {
        groupCode: 90,
        value: '3',
      })
      state = reducer(state, {
        groupCode: 38,
        value: '-4',
      })
      state = reducer(state, {
        groupCode: 10,
        value: '1060089.49836839',
      })
      state = reducer(state, {
        groupCode: 20,
        value: '7015009.4142235',
      })
      state = reducer(state, {
        groupCode: 10,
        value: '1060089.70946181',
      })
      state = reducer(state, {
        groupCode: 20,
        value: '7015009.07575417',
      })
      state = reducer(state, {
        groupCode: 10,
        value: '1060090.92765585',
      })
      state = reducer(state, {
        groupCode: 20,
        value: '7015010.33168483',
      })
      state = reducer(state, {
        groupCode: 0,
        value: "ENDSEC",
      })
    }).toThrowError("expected value to be defined")

    expect(() => {
      let state = reducer(InitialState, {
        groupCode: 0,
        value: "SECTION",
      })
      state = reducer(state, {
        groupCode: 2,
        value: "ENTITIES",
      })
      state = reducer(state, {
        groupCode: 0,
        value: "LWPOLYLINE",
      })
      state = reducer(state, {
        groupCode: 5,
        value: "20EB4",
      })
      state = reducer(state, {
        groupCode: 100,
        value: 'AcDbEntity',
      })
      state = reducer(state, {
        groupCode: 8,
        value: '0',
      })
      state = reducer(state, {
        groupCode: 100,
        value: 'AcDbPolyline',
      })
      state = reducer(state, {
        groupCode: 70,
        value: '0',
      })
      state = reducer(state, {
        groupCode: 90,
        value: '18',
      })
      state = reducer(state, {
        groupCode: 38,
        value: '-4',
      })
      state = reducer(state, {
        groupCode: 10,
        value: '1060089.49836839',
      })
      state = reducer(state, {
        groupCode: 20,
        value: '7015009.4142235',
      })
      state = reducer(state, {
        groupCode: 10,
        value: '1060089.70946181',
      })
      state = reducer(state, {
        groupCode: 20,
        value: '7015009.07575417',
      })
      state = reducer(state, {
        groupCode: 10,
        value: '1060090.92765585',
      })
      state = reducer(state, {
        groupCode: 20,
        value: '7015010.33168483',
      })
      state = reducer(state, {
        groupCode: 0,
        value: "ENDSEC",
      })
    }).toThrowError("wrong number of vertices for LWPOLYLINE")
  })
})
