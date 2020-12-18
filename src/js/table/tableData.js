export default class TableData {
  constructor(dataName) {
    this.node = document.createElement('td');
    this.node.textContent = dataName;
    return this.node;
  }
}
