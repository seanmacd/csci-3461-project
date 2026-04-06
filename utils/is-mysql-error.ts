export interface MysqlError extends Error {
  code?: string
  errno?: number
  sqlMessage?: string
}

export function isMysqlError(err: unknown): err is MysqlError {
  return typeof err === 'object' && err !== null && 'code' in err
}
