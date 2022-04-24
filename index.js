const Calculator = () => {
  const state = {
    current: 0,
    previous: null,
    operator: null,
    result: null,
  }

  function display() {
    const { current, previous } = state
    let currentValue = current && current[0] === '.' ? 0 + current : current === null ? previous : current
    
    const preview = document.getElementById('prev-result')
    preview.innerHTML = previous || ''
    
    const mainView = document.getElementById('result')

    mainView.style.fontSize = current && String(current).length > 11 ? '32px' : '50px'
    mainView.innerHTML = currentValue
  }

  function setCurrent(val) {
    state.setValues({ current: val })
    return display()
  }

  function setOperator(id) {
    if (!state.operator && state.current) {
      state.setValues(prev => ({ 
        operator: id, 
        previous: prev.current,
        current: null
      }))
    } else {
      state.setValues({operator: id})
    }
    return display()
  }

  function setResult() {
    let result
    const num1 = Number(state.previous)
    const num2 = Number(state.current)

    if (!state.previous && !state.result || !state.operator) {
      state.setValues({
        current: Number(state.current),
        previous: state.current
      })
      return display()
    }

    switch(state.operator) {
      case 'add':
        result = num1 + num2 
        break
      case 'subtract':
        result = num1 - num2 
        break
      case 'multiply':
        result = num1 * num2 
        break
      case 'divide':
        result = num2 ? num1 / num2 : 'Cannot divide by zero'
        break
      default:
        break
    }

    state.setValues({
      current: result,
      previous: null,
      operator: null,
      result: result
    })
    return display()
  }

  function clear() {
    state.setValues({
      current: 0,
      previous: null,
      operator: null,
      result: null
    })
    return display()
  }

  function clearEntry() {
    state.setValues({current: 0})
    return display()
  }

  function negate() {
    state.setValues(prev => ({ 
      current: prev.current ? -prev.current : -prev.previous
    }))
    return display()
  }

  return { 
    state, 
    setOperator, 
    setCurrent,
    setResult,
    otherKeys: {
      clear,
      clearEntry,
      negate
    }
  }
}

const { state, setOperator, setCurrent, setResult, otherKeys } = Calculator()

Object.prototype.setValues = function(cb) {
  const callback = typeof cb === 'function' ? cb(this) : cb
  const newObj = {...this, ...callback}  
  for (const [key, value] of Object.entries(newObj)) {
    Object.defineProperty(this, key, { value })
  } return
}

const allKeys = document.querySelectorAll('.key')
allKeys.forEach(btn => {
  const key = btn.textContent
  if (Number(key) || key == 0 || key === '.') {
    return btn.addEventListener('click', keyDigits)
  } else return btn.addEventListener('click', keyOperators)
  
})

function keyOperators() {
  const { current, previous } = state
  switch(this.id) {
    case 'clear':
      return otherKeys.clear()
    case 'clear-entry':
      return otherKeys.clearEntry()
    case 'plus-minus':
      return otherKeys.negate()
    case 'equal':
      return setResult()
    default:
      if (current && previous) setResult()
      return setOperator(this.id)
  }
}

function keyDigits() {
  const num = this.textContent
  const { current, operator } = state

  if (num === '.' && String(current).includes('.')) return
  if (current == 0 || current === null || !operator && typeof current === 'number' ) {
    setCurrent(num)
  } else {
    if ( current.length > 14 ) return
    setCurrent(current + num)
  }
}