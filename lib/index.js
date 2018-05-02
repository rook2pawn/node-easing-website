
Function.prototype.clone = function() {
    var cloneObj = this;
    if(this.__isClone) {
      cloneObj = this.__clonedFrom;
    }

    var temp = function() { return cloneObj.apply(this, arguments); };
    for(var key in this) {
        temp[key] = this[key];
    }

    temp.__isClone = true;
    temp.__clonedFrom = cloneObj;

    return temp;
};

const getBase = function() {
  const isGithub = (window.location.host.indexOf('github') != -1)
  return isGithub ? "choo-examples" : "/"
}
const getBaseRoute = function() {
  const isGithub = (window.location.host.indexOf('github') != -1)
  return isGithub ? "choo-examples" : ""
}

exports.getBase = getBase;
exports.getBaseRoute = getBaseRoute;
