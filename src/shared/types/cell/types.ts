import { createCellNamesArray } from '@shared/utils/cells/createCellNamesArray'

const cells = createCellNamesArray()

export type TCellName = typeof cells extends (infer U)[] ? U : never
