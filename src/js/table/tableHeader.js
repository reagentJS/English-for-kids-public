export default class TableHeader {
  constructor(headerName) {
    this.node = document.createElement('th');
    this.node.textContent = headerName;
    return this.node;
  }
}
