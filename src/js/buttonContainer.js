import Component from './components';

export default class StartButton extends Component {
  constructor(...args) {
    super(...args);

    this.node = new Component('div', 'start-button-container').node;
    this.startButton = new Component('div', 'start-button').node;

    this.starsLeft = document.createElement('div');
    this.starsLeft.classList.add('container-stars', 'stars-left');
    this.starsRight = document.createElement('div');
    this.starsRight.classList.add('container-stars', 'stars-right');
    this.node.append(this.starsLeft, this.startButton, this.starsRight);

    this.setButtonContentStart();
  }

  setInvisible() {
    this.node.classList.add('invis');
  }

  setVisible() {
    this.node.classList.remove('invis');
  }

  setButtonContentStart() {
    this.startButton.textContent = 'Start game';
  }

  setButtonContentRepeat() {
    this.startButton.textContent = 'Repeat';
  }

  setButtonContentContinue() {
    this.startButton.textContent = 'Continue game';
  }

  appendSign(starOrCross) {
    let localContainer = null;
    const sign = document.createElement('div');
    sign.classList.add(starOrCross);

    if (starOrCross === 'star') {
      localContainer = this.starsLeft;
      sign.innerHTML = `
        <svg id="Capa_1" width="36" height="36" enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="256" x2="256" y1="512" y2="0"><stop offset="0" stop-color="#fd5900"/><stop offset="1" stop-color="#ffde00"/></linearGradient><linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="256" x2="256" y1="392.353" y2="91"><stop offset="0" stop-color="#ffe59a"/><stop offset="1" stop-color="#ffffd5"/></linearGradient><g id="Star"><g><g><circle cx="256" cy="256" fill="url(#SVGID_1_)" r="256"/></g></g><g><g><path d="m412.924 205.012c-1.765-5.43-6.458-9.388-12.108-10.209l-90.771-13.19-40.594-82.252c-2.527-5.12-7.742-8.361-13.451-8.361s-10.924 3.241-13.451 8.362l-40.594 82.252-90.771 13.19c-5.65.821-10.345 4.779-12.109 10.209s-.292 11.391 3.796 15.376l65.683 64.024-15.506 90.404c-.965 5.627 1.348 11.315 5.967 14.671 4.62 3.356 10.743 3.799 15.797 1.142l81.188-42.683 81.188 42.683c5.092 2.676 11.212 2.189 15.797-1.142 4.619-3.356 6.933-9.043 5.968-14.671l-15.506-90.404 65.682-64.024c4.088-3.986 5.559-9.947 3.795-15.377z" fill="url(#SVGID_2_)"/></g></g></g></svg>
      `;
    } else {
      localContainer = this.starsRight;
      sign.innerHTML = `
        <svg width="36" height="36" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m256 512c-141.160156 0-256-114.839844-256-256s114.839844-256 256-256 256 114.839844 256 256-114.839844 256-256 256zm0-475.429688c-120.992188 0-219.429688 98.4375-219.429688 219.429688s98.4375 219.429688 219.429688 219.429688 219.429688-98.4375 219.429688-219.429688-98.4375-219.429688-219.429688-219.429688zm0 0"/><path d="m347.429688 365.714844c-4.679688 0-9.359376-1.785156-12.929688-5.359375l-182.855469-182.855469c-7.144531-7.144531-7.144531-18.714844 0-25.855469 7.140625-7.140625 18.714844-7.144531 25.855469 0l182.855469 182.855469c7.144531 7.144531 7.144531 18.714844 0 25.855469-3.570313 3.574219-8.246094 5.359375-12.925781 5.359375zm0 0"/><path d="m164.570312 365.714844c-4.679687 0-9.355468-1.785156-12.925781-5.359375-7.144531-7.140625-7.144531-18.714844 0-25.855469l182.855469-182.855469c7.144531-7.144531 18.714844-7.144531 25.855469 0 7.140625 7.140625 7.144531 18.714844 0 25.855469l-182.855469 182.855469c-3.570312 3.574219-8.25 5.359375-12.929688 5.359375zm0 0"/></svg>
      `;
    }

    if (localContainer.childNodes.length >= 8) {
      localContainer.innerHTML = '';
    }
    localContainer.append(sign);
  }

  hasCrosses() {
    return this.starsRight.hasChildNodes();
  }

  hasStarsOrCrosses() {
    return (this.starsLeft.hasChildNodes() || this.starsRight.hasChildNodes());
  }
}
