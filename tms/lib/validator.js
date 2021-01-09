const _ = require('underscore');

const validateDictObj = (obj) => {
  const keys = Object.keys(obj).map(el => el.toLowerCase())
  return _.isEqual(keys, ["source", "target", "sourcelanguage", "targetlanguage"])
}

module.exports = {
  validateDictObj,
}
