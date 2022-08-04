export function exportJSON(data = {}, filename) {
  let link = document.createElement('a')
  if (!filename) {
    filename = `${Date.now()}.json`
  }
  if (!/\.json$/.test(filename)) {
    filename += '.json'
  }
  link.download = filename
  link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
  link.click()
  link = null
}
