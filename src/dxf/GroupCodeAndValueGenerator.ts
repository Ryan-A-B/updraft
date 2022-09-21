export interface GroupCodeAndValue {
    groupCode: number
    value: any
}

async function* GroupCodeAndValueGenerator(lines: AsyncGenerator<string, string, unknown>): AsyncGenerator<GroupCodeAndValue, void, unknown> {
    for await (let line of lines) {
        const groupCode = Number(line)
        const value = (await lines.next()).value
        yield { groupCode, value }
    }
    return
}

export default GroupCodeAndValueGenerator