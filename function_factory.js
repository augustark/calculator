const Calculator = () => {
  const state = {
    current: 0,
    previous: null,
    operator: null,
    result: null
  }

  const setCurrent = value => {
    state.setValues({ current: value })
    display()
    return
  }

  const setPreviousByValue = value => {
    return state.setValues({ previous: value })
  }

  const setPrevious = id => {
    return state.setValues(prev => ({
      ...prev,
      operator: id,
      previous: prev.current,
      current: null
    }))
  }

  const getResult = () => {
    const { current, previous, result, operator } = state
    const num1 = Number(previous)
    const num2 = Number(current)

    if (!previous && !result || !operator) {
      setCurrent(Number(current))
      setPreviousByValue(current)
      display()
    }

    switch(state.operator) {
      case 'clear':
        return clearAll()
      case 'clear-entry':
        return clearEntry()
      case 'plus-minus':
        return negate()
      case 'add':
        state.setValues({ result: num1 + num2 })
        break
      case 'subtract':
        state.setValues({ result: num1 - num2 })
        break
      case 'multiply':
        state.setValues({ result: num1 * num2 })
        break
      case 'divide':
        state.setValues({
          result:  num2 ? num1 / num2 : 'Cannot divide by zero'
        })
        break
      default:
        break
    }

    state.setValues(prev => ({
      ...prev,
      current: prev.result,
      previous: null,
      operator: undefined
    }))
    display()
    return
  }

  const clearAll = () => {
    state.setValues(prev => ({
      ...prev,
      current: 0,
      previous: null,
      result: null
    }))
    display()
    return
  }
  
  const clearEntry = () => {
    state.setValues({ current: 0 })
    display()
    return
  }

  const negate = () =>  {
    state.setValues(prev => ({ 
      current: prev.current ? -prev.current : -prev.previous
    }))
    display()
    return
  }

  const display = () => {
    const { current, previous } = state
    let currentValue = current[0] === '.' ? 0 + current : current
  
    const mainView = document.getElementById('result')
    mainView.innerHTML = currentValue

    const preview = document.getElementById('prev-result')
    preview.innerHTML = previous || '--'
  }

  return {
    state, 
    setCurrent,
    setPrevious,
    getResult,
  }
}

const { state, setCurrent, setPrevious, getResult } = Calculator()
const { current, previous, operator } = state

const Initial = () => {
  setMethod()
  const allKeys = document.querySelectorAll('.key')
  allKeys.forEach(btn => {
    const key = btn.textContent
    if (Number(key) || key == 0 || key === '.') {
      return btn.addEventListener('click', forKeyDigits)
    }
    return btn.addEventListener('click', forOperators)
  })
}

function setMethod() {
  Object.prototype.setValues = function(cb) {
    const callback = typeof cb === 'function' ? cb(this) : cb
    const newObj = {...this, ...callback}  
    for (const [key, value] of Object.entries(newObj)) {
      Object.defineProperty(this, key, { value })
    }
    return
  }
}

function forOperators() {
  switch(this.id) {
    case 'equal':
      return getResult()
    default:
      if (current && previous) {
        getResult()
      }
      return setPrevious(this.id)
  }
}

function forKeyDigits() {
  const val = this.textContent
  if (val === '.' && String(current).includes('.')) return
  else if (
    current == 0 || 
    current === null || 
    (!operator && typeof current === 'number') 
  ) {
    setCurrent(val)
  } else {
    setCurrent(current + val)
  }
}

Initial()