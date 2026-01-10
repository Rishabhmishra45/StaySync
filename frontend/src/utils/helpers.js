export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0
}