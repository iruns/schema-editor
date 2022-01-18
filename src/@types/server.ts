export type FileNamesRes = {
  folder: string
  files: string[]
}

export type DataReq = {
  folder?: string
  file?: string
  delete?: boolean
  start?: number
  end?: number
  lines?: string[]
}

export type DataRes = {
  req: DataReq
  lines: string[]
}

export type ErrorRes = {
  req: DataReq
  message: string
  content: any
}

export enum ServerReqType {
  REQ_DATA = 'REQ_DATA',
}
export enum ServerResType {
  ERROR = 'ERROR',
  FILE_NAMES = 'FILE_NAMES',
  LINE_WRITTEN = 'LINE_WRITTEN',
  LINES_READ = 'LINES_READ',
}
