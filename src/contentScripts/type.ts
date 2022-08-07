export interface Project {
  color: string
  origin: string
  name: string
  switchOn: boolean
  rules?: Rule[]
}

export type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type StatusType = 200 | 201 | 500 | 401 | 403 | 404
export type AjaxType = 'fetch' | 'xhr'

export interface Rule {
  name: string
  path: string
  response: string
  switchOn: boolean
  delay: number
  status: StatusType
  method: MethodType
}

export type MockResult = Pick<Rule, 'response' | 'status' | 'path'>

export interface ProjectStorage {
  ajaxInterceptor_projects: Project[]
  ajaxInterceptor_current_project: string
}
export interface Request {
  headers: any
  method: MethodType
  type: AjaxType
  url: string
}

export interface Response {
  headers: any
  config?: any
  // 用于替换 response 字段
  responseTxt: string
  status: StatusType
  statusText?: string
  isMock: boolean
  rulePath: string
  url: string
}
export interface NetworkItem {
  request: Request
  response: Response
}
