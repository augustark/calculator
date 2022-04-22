class State {
  constructor() {
    this.current = 0
    this.previous = null
    this.result = null
    this.operator = undefined
  }

  getCurrent() {
    return this.current
  }

  setCurrent(value) {
    return this.current = value
  }

  getPrevious() {
    return this.previous
  }

  setPrevious(id) {
    this.operator = id
    this.previous = this.current
    this.current = null
  }

  getResult() {
    const num1 = parseFloat(this.previous)
    const num2 = parseFloat(this.current)

    switch(this.operator) {
      case 'add':
        this.result = num1 + num2
      case 'subtract':
        this.result = num1 - num2
      case 'multiply':
        this.result = num1 * num2
      case 'divide':
        this.result = num2 ? num1 + num2 : 'Cannot divide by zero'
      default:
        this.current = this.result
        this.previous = null
        this.operator = undefined
    }
  }

  clearAll() {
    this.current = 0
    this.previous = null
    this.result = null
  }
}

const initial = new State()

function display() {
  const mainView = document.getElementById('result')
  mainView.innerHTML = initial.getCurrent()

  const preview = document.getElementById('prev-result')
  preview.innerHTML = initial.getPrevious() || '--'

  console.log(initial)
}

const allKeys = document.querySelectorAll('.key')
allKeys.forEach(key => {
  if (Number(key.textContent) || key.textContent == 0) {
    return key.addEventListener('click', forKeyDigits)
  }
  return key.addEventListener('click', forOperators)
})

function forOperators() {
  switch(this.id) {
    case 'clear':
      initial.clearAll()
      display()
      return 
    case 'equal':
      if (!initial.previous && !initial.result) {
        initial.setCurrent(parseFloat(initial.current))
        display()
        return 
      } 
      initial.getResult()
      display()
      return
    default:
      if (initial.current && initial.previous) {
        initial.getResult()
        display()
      }
      initial.setPrevious(this.id)
      console.log(initial)
      return
  }
}

function forKeyDigits() {
  if (
    initial.current == 0 || 
    initial.current === null || 
    (!initial.operator && typeof initial.current === 'number')
  ) {
    initial.setCurrent(this.textContent)
    display()
  } else {
    initial.setCurrent(initial.current + this.textContent)
    display()
  }
}