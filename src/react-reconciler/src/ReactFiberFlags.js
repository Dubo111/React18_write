export const NoFlags = 0b00000000000000000000000000//0 没有任何操作
export const PerformedWork = 0b00000000000000000000000001 //未定义
export const Placement = 0b00000000000000000000000010 //2 插入
export const Update = 0b00000000000000000000000100//4 更新
// export const ChildDeletion = 0b00000000000000000000001000

export const MutationMask = Placement | Update //6  2+4
