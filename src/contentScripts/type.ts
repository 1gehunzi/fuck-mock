export interface Project {
  color: string
  origin: string
  name: string
  switchOn: boolean
  rules?: Rule[]
}

export type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type StatusType = 200 | 201 | 500 | 401 | 403 | 404
export interface Rule {
  name: string
  path: string
  response: string
  switchOn: boolean
  delay: number
  status: StatusType
  method: MethodType
}

export interface ProjectStorage {
  ajaxInterceptor_projects: Project[],
  ajaxInterceptor_current_project: string
}
// 自定义的 Event 类型该设置成什么呢
// export interface MyEvent {
//   detail: string
// }
