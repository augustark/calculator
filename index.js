class State {
  constructor() {
    this.current = 0
    this.previous = null
    this.result = null
    this.operator = undefined
  }

  setCurrent(value) {
    this.current = value
    return 
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
    const num1 = Number(this.previous)
    const num2 = Number(this.current)

    if (!initial.previous && !initial.result) {
      this.setCurrent(Number(initial.current))
      this.previous = this.current
      this.display()
      return 
    } else if (!initial.operator) {
      this.setCurrent(Number(initial.current))
      this.previous = this.current
      this.display()
      return console.log('hello')
    }

    switch(this.operator) {
      case 'add':
        this.result = num1 + num2
        break
      case 'subtract':
        this.result = num1 - num2
        break
      case 'multiply':
        this.result = num1 * num2
        break
      case 'divide':
        this.result = num2 ? num1 / num2 : 'Cannot divide by zero'
        break
      default:
        break
    }

    this.current = this.result
    this.previous = null
    this.operator = undefined
    this.display()
  }

  clearAll() {
    this.current = 0
    this.previous = null
    this.result = null
    this.display()
  }
  
  clearEntry() {
    this.current = 0
    this.display()
  }

  negate() {
    this.current = this.current ? -this.current : -this.previous
    this.display()
  }

  display() {
    let currentValue = this.current[0] === '.' ? 0 + this.current : this.current
  
    const mainView = document.getElementById('result')
    mainView.innerHTML = currentValue

    const preview = document.getElementById('prev-result')
    preview.innerHTML = initial.getPrevious() || '--'

    console.log(initial)
  }
}

const initial = new State()

function INIT() {
  const allKeys = document.querySelectorAll('.key')
  allKeys.forEach(key => {
    if ( 
      Number(key.textContent) || 
      key.textContent == 0 || 
      key.textContent === '.'
    ) {
      return key.addEventListener('click', forKeyDigits)
    }
    return key.addEventListener('click', forOperators)
  })
}

function forOperators() {
  switch(this.id) {
    case 'clear':
      return initial.clearAll()
    case 'clear-entry':
      return initial.clearEntry()
    case 'plus-minus':
      return initial.negate()
    case 'equal':
      return initial.getResult()
    default:
      if (initial.current && initial.previous) {
        initial.getResult()
      }
      initial.setPrevious(this.id)
      console.log(initial)
      return
  }
}

function forKeyDigits() {
  const val = this.textContent

  if (val === '.' && String(initial.current).includes('.')) return
  else if (
    initial.current == 0 || 
    initial.current === null || 
    (!initial.operator && typeof initial.current === 'number') 
  ) {
    initial.setCurrent(val)
    initial.display()
  } else {
    initial.setCurrent(initial.current + val)
    initial.display()
  }
}

INIT()