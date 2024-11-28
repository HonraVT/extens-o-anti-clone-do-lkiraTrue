export function showError() {
  let element = getErrorElement()
  element.className = 'show'
  setTimeout(() => element.className = element.className.replace('show', ''), 3000);
}

export function showSucessMessage() {
  let element = getSuccessElement()
  element.className = 'show'
  setTimeout(() => element.className = element.className.replace('show', ''), 3000);
}

function getErrorElement() {
  return document.getElementById('error-message')
}

function getSuccessElement() {
  return document.getElementById('success-message')
}

export function stringToArray(string) {
  return string.split(',').filter((value) => value).map(x => x.trim())
}

