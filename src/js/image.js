export default class Image {
  constructor(src, alt, width = 0, height = 0, cssClass = '') {
    const node = document.createElement('img');

    node.setAttribute('src', `./assets/${src}`);
    node.setAttribute('alt', alt);

    if (width) {
      node.setAttribute('width', width);
    }
    if (height) {
      node.setAttribute('height', height);
    }
    if (cssClass) {
      node.classList.add(...cssClass.split(' '));
    }

    this.node = node;
  }
}
