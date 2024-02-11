Storage.prototype.stashContent = function () {
  // 'this' är det våran localStorage eller sessionStoragez
  const keyValuePairs = Object.entries(this);
  this.clear();
  return keyValuePairs;
};
Storage.prototype.restoreContent = function (content) {
  // 'this' är det våran localStorage eller sessionStorage
  this.clear();

  for (let [key, value] of content) {
    this.setItem(key, value);
  }
};
