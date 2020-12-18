export default class TableRow {
  constructor(rowName) {
    this.node = document.createElement('tr');
    this.node.textContent = rowName;
    return this.node;
  }
}
