export function createCellNamesArray(): string[] {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8]
    const cellNames: string[] = []

    for (let file of files) {
        for (let rank of ranks) {
            cellNames.push(file + rank)
        }
    }

    return cellNames
}
