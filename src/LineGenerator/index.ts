async function* LineGenerator(blob: Blob) {
    const chunkSize = 1024
    let chunkStart = 0
    let buffer = ""
    let position = 0
    let endOfFileReached = false
    let done = false

    async function getNextChunk() {
        const chunkEnd = chunkStart + chunkSize
        const chunk = await blob.slice(chunkStart, chunkEnd).text()
        endOfFileReached = chunk.length < chunkSize
        chunkStart = chunkEnd
        return chunk
    }

    async function getNextLine(): Promise<string> {
        const index = buffer.indexOf("\n", position)
        const notFound = index === -1
        if (notFound) {
            if (endOfFileReached) {
                done = true
                return buffer
            }
            const chunk = await getNextChunk()
            position = buffer.length
            buffer += chunk
            return getNextLine()
        }
        const line = buffer.substring(0, index)
        position = 0
        buffer = buffer.substring(index + 1)
        return line
    }

    while (true) {
        const line = await getNextLine()
        if (done) return line
        yield line
    }
}

export default LineGenerator
