import { unionWith } from 'lodash-es'

const validateProject = (project) => {
  const keys = Object.keys(project).sort().toString()
  const arr = ['name', 'color', 'origin', 'rules', 'switchOn'].sort().toString()
  const arr01 = ['name', 'color', 'origin', 'switchOn'].sort().toString()
  if (keys === arr || keys === arr01 ) {
    return true
  }

  return false


}
export const validProjectList = (arr) => {
  return arr?.every(item => validateProject(item))
}


export const mergeProject = (origin, target) => {
  const originNames = origin?.map(item => item.name) || []
  const targetNames = target?.map(item => item.name) || []

  const names = Array.from(new Set([...originNames, ...targetNames]))
  return names.map(name => {
    const originItem = origin.find(item => item.name === name)
    const targetItem = target.find(item => item.name === name)
    const rules = unionWith((originItem?.rules || []), (targetItem?.rules || []), (obj1, obj2) => {
      return obj1.name === obj2.name
    })

    const object = originItem || targetItem

    return {...object, rules}
  })
}
