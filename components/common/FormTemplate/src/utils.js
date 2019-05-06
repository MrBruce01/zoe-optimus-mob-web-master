function isTrue(val, def) {
  if(val === undefined) {
    if(def !== undefined) {
      return def
    }
    return true
  }
  if (typeof (val) === 'boolean') {
    return val
  }
  else if(typeof (val) === 'string') {
    if(val === 'true') {
      return true
    }
    else {
      return false
    }
  }
  else {
    return Boolean(val)
  }
}

function isNum(val, def) {
  if(val === 0||val) {
    if(typeof(val) === 'number') {
      return val
    }
    else if(typeof(val) === 'string') {
      return isNaN(Number(val)) ? def: Number(val)
    }
  }
  else {
    return def
  }
  return 0
}

function isArray(val, def) {
  if(val) {
    if(typeof(val) === 'string') {
      try {
        return eval("(" + val + ")")
      } catch (ex) {
        return []
      }
    }
    else if(typeof(val) === 'object') {
      return val
    }
    else {
      return []
    }
  }
  else {
    if(def === 'undefined') {
      return undefined
    }
    else if(def !== undefined) {
      return def
    }
  }
}

export { isTrue, isNum, isArray }