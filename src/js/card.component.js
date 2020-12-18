export default class Card {
  constructor(isStartPage = false, image = '', word = '', translation = '', audioSrc = '') {
    this.node = document.createElement('div');
    this.node.classList.add('card');
    this.word = word;
    this.state = 'train';

    if (image) {
      this.image = document.createElement('img');
      this.image.setAttribute('src', `./assets/${image}`);
      this.image.setAttribute('alt', '');
      this.node.append(this.image);
    }

    if (isStartPage) {
      const wordHtml = document.createElement('h3');
      wordHtml.textContent = word;
      this.node.append(wordHtml);
    } else {
      this.translation = translation;
      this._createWordContainer();
      this.node.append(this.wordContainer);
      if (audioSrc) {
        this.audio = new Audio();
        this.audio.src = `./assets/${audioSrc}`;
        this.audio.load();
      }
      this.isDirect = true;
      this._addListeners();
      this.wordSpan.textContent = this.word;
    }
  }

  _createWordContainer() {
    this.wordContainer = document.createElement('div');
    this.wordContainer.classList.add('word__container');
    this.wordSpan = document.createElement('span');
    this.rotate = document.createElement('div');
    this.rotate.classList.add('rotate');
    this.rotate.innerHTML = `
      <svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" viewBox="0, 0, 400,400"><g id="svgg"><path id="path0" d="M149.333 106.849 C -33.313 127.384,-41.223 252.474,138.667 275.531 C 146.978 276.596,157.155 277.883,161.284 278.391 L 168.790 279.314 169.284 303.117 L 169.778 326.920 214.222 292.359 C 238.667 273.351,258.667 256.989,258.667 256.000 C 258.667 255.011,238.667 238.649,214.222 219.641 L 169.778 185.080 169.280 208.294 L 168.783 231.508 158.614 230.340 C 114.170 225.237,73.024 211.579,59.659 197.495 L 54.430 191.983 60.245 185.983 C 103.148 141.719,300.841 141.956,339.792 186.318 L 345.150 192.421 340.131 197.714 C 334.182 203.985,316.718 213.058,300.000 218.562 L 288.000 222.512 288.000 246.565 L 288.000 270.618 294.624 269.375 C 380.118 253.336,418.057 192.558,369.823 148.909 C 332.872 115.470,236.377 97.063,149.333 106.849 " stroke="none" fill="#000000" fill-rule="evenodd"></path></g></svg>
    `;
    this.wordContainer.append(this.wordSpan, this.rotate);
  }

  _addListeners() {
    if (this.audio) {
      this._addListenerForSound();
    }
    this._addListenerToRotateDirect();
    this._addListenerToRotateBack();
    this._addListenerForStatsTrain();
  }

  _addListenerForSound() {
    this.node.addEventListener('click', () => {
      if (!this.node.classList.contains('rotated-true') && this.audio.readyState && this.state === 'train') {
        this.audio.play();
      }
    });
  }

  _addListenerToRotateDirect() {
    this.rotate.addEventListener('click', (e) => {
      e.stopPropagation();
      this._toggleWord();
      this._rotateCard();
    });
  }

  _addListenerToRotateBack() {
    this.node.addEventListener('mouseleave', () => {
      if (!this.isDirect) {
        this._toggleWord();
        this._rotateCard();
      }
    });
  }

  _addListenerForStatsTrain() {
    this.node.addEventListener('click', () => {
      if (!this.node.classList.contains('rotated-true') && this.state === 'train') {
        let stats = null;
        if (localStorage.getItem(this.word)) {
          stats = localStorage.getItem(this.word);
          stats = JSON.parse(stats);
          stats.trainClicks = stats.trainClicks ? stats.trainClicks + 1 : 1;
        } else {
          stats = {};
          stats.trainClicks = 1;
        }
        stats = JSON.stringify(stats);
        localStorage.setItem(this.word, stats);
      }
    });
  }

  _toggleWord() {
    if (this.isDirect) {
      this.wordSpan.textContent = this.translation;
    } else {
      this.wordSpan.textContent = this.word;
    }
    this.isDirect = !this.isDirect;
  }

  _rotateCard() {
    if (this.isFirstClickPassed) {
      this.node.classList.toggle('rotated-false');
      this.node.classList.toggle('scale-false');
      this.image.classList.toggle('rotated-false');
      this.wordContainer.classList.toggle('rotated-false');
    }
    this.isFirstClickPassed = true;

    this.node.classList.toggle('rotated-true');
    this.node.classList.toggle('scale-true');
    this.image.classList.toggle('rotated-true');
    this.wordContainer.classList.toggle('rotated-true');
  }

  setStateTrain() {
    this.state = 'train';
    this.node.classList.remove('card-play');
    this.image.classList.remove('image-play');
    this.wordContainer.classList.remove('invis');
  }

  setStatePlay() {
    this.state = 'play';
    this.node.classList.add('card-play');
    this.image.classList.add('image-play');
    this.wordContainer.classList.add('invis');
  }
}
