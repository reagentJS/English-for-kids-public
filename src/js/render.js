import Card from './card.component';
import cardsData from '../assets/cardsData';
import Nav from './nav.component';
import ButtonContainer from './buttonContainer';
import Image from './image';
import Audioplayer from './audioplayer';
import Statistics from './statistics';

export default class Render {
  constructor() {
    this.main = document.querySelector('.main');

    this.navObject = new Nav('nav');
    this.nav = this.navObject.node;
    this._addListenerToNav();

    const pageNameNode = document.createElement('h3');
    pageNameNode.classList.add('page_name');
    this.categories = cardsData[0].slice();
    this.main.append(pageNameNode);

    this.audioplayer = new Audioplayer();
    this.state = 'train';
    this.winOrLooseObject = {
      win: 'Congratulations, you won!',
      loose: 'You loose, but you can try again!',
    };
  }

  _addListenerToNav() {
    this.navObject.categoriesHtml.forEach((listItem) => {
      listItem.addEventListener('click', () => {
        this.navObject.burger.childNodes[0].checked = false;
        if (listItem.childNodes[0].classList.contains('link-active')) {
          return;
        }

        this.navObject.categoriesHtml.forEach((listItemEvery) => {
          listItemEvery.childNodes[0].classList.remove('link-active');
        });
        listItem.childNodes[0].classList.add('link-active');

        this._render(listItem.childNodes[0].textContent);
      });
    });
  }

  _render(pageName) {
    this.main.childNodes[0].textContent = pageName;
    this._cleanMainExceptPageName();
    if (pageName === 'Start Page') {
      return this._renderStartPage();
    }
    if (pageName === 'Statistics') {
      return this._renderStatistics();
    }

    this.indexOfCategory = this._defineIndex(pageName);
    if (this.indexOfCategory === -1) {
      console.log(`Can not find category '${pageName}' in file 'english-for-kids/assets/cardsData.js'`);
      return null;
    }

    this._createRegularCards();
    this._appendRegularCards();
    this._addListenersToCards();

    this.buttonContainer = new ButtonContainer();
    this._addListenerToStartButton();
    this._appendButtonContainer();

    this.randomIndex = null;
    this.indexes = [];
    return null;
  }

  _cleanMainExceptPageName() {
    while (this.main.childNodes[1]) {
      this.main.removeChild(this.main.childNodes[1]);
    }
  }

  _renderStartPage() {
    const cardsOnStartPage = [];
    if (this.cardsRegular) {
      this.cardsRegular.length = 0;
    }

    this.categories.forEach((category) => {
      if (category.categoryName !== 'Start Page' && category.categoryName !== 'Statistics') {
        const { node } = new Card(true, category.image, category.categoryName);

        node.addEventListener('click', () => {
          this.navObject.categoriesHtml.forEach((listItem) => {
            if (listItem.childNodes[0].textContent === node.childNodes[1].textContent) {
              listItem.click();
            }
          });
        });

        cardsOnStartPage.push(node);
      }
    });

    this.main.append(...cardsOnStartPage);
  }

  _renderStatistics() {
    if (this.cardsRegular) {
      this.cardsRegular.length = 0;
    }
    this.statistics = new Statistics();

    this.statistics.resetStats.addEventListener('click', () => {
      localStorage.clear();
      this._cleanMainExceptPageName();
      this._renderStatistics();
    });

    this.main.append(this.statistics.node);
    this._addListenerToStatistics();
  }

  _addListenerToStatistics() {
    const load = document.querySelector('#load');
    const form = document.forms.my;

    this.statistics.addListenersForSorting(load);

    load.addEventListener('click', (event) => {
      event.preventDefault();

      if (this.optionsString === form.sort.value) {
        return;
      }
      this.optionsString = form.sort.value;

      if (form.sort.value === 'default') {
        this._cleanMainExceptPageName();
        this._renderStatistics();
      }
    });
  }

  _defineIndex(pageName) {
    let indexLocal = -1;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].categoryName === pageName) {
        indexLocal = i;
        break;
      }
    }
    return indexLocal;
  }

  _createRegularCards() {
    this.cardsRegular = [];
    const cardOptions = cardsData[this.indexOfCategory].slice();

    cardOptions.forEach((item) => {
      const newNode = new Card(false, item.image, item.word, item.translation, item.audioSrc);
      this.cardsRegular.push(newNode);
    });
  }

  _addListenersToCards() {
    this.cardsRegular.forEach((item) => {
      item.node.addEventListener('click', () => {
        if (this.randomIndex !== null && this.state === 'play') {
          const indexLocal = this.cardsRegular.indexOf(item);

          if (indexLocal === this.randomIndex) {
            item.node.classList.add('fade');
            this.indexes.push(indexLocal);
            this._reactToCorrectAnswer();
            this._addStatsPlay(item, 'correct');
          } else if (!this.indexes.includes(indexLocal)) {
            this._reactToWrongAnswer();
            this._addStatsPlay(item, 'wrong');
          }
        }
      });
    });
  }

  _appendRegularCards() {
    this.cardsRegular.forEach((card) => {
      this.main.append(card.node);
      if (this.state === 'train') {
        card.setStateTrain();
      } else card.setStatePlay();
    });
  }

  _addListenerToStartButton() {
    this.buttonContainer.startButton.addEventListener('click', () => {
      this.buttonContainer.setButtonContentRepeat();
      if (this.randomIndex !== null) {
        this.cardsRegular[this.randomIndex].audio.play();
      } else this._startGame();
    });
  }

  _appendButtonContainer() {
    if (this.state === 'train') {
      this.buttonContainer.setInvisible();
    } else this.buttonContainer.setVisible();
    this.main.append(this.buttonContainer.node);
  }

  setStateTrain() {
    this.state = 'train';

    if (this.cardsRegular) {
      this.cardsRegular.forEach((card) => {
        card.setStateTrain();
        card.node.classList.remove('fade');
      });
      this.buttonContainer.setInvisible();
    }
  }

  setStatePlay() {
    this.state = 'play';
    if (this.buttonContainer) {
      this.buttonContainer.setButtonContentStart();
    }

    if (this.cardsRegular) {
      this.cardsRegular.forEach((card, index) => {
        card.setStatePlay();
        if (this.indexes && this.indexes.includes(index)) {
          card.node.classList.add('fade');
        }
      });

      if (this.buttonContainer.hasStarsOrCrosses()) {
        this.buttonContainer.setButtonContentContinue();
      }
      this.buttonContainer.setVisible();
    }
  }

  _startGame() {
    this.delay = this.randomIndex === null ? 0 : 1300;
    this.randomIndex = this._getRandomIndex();
    if (this.indexes.length === this.cardsRegular.length) {
      return;
    }

    setTimeout(() => {
      this.cardsRegular[this.randomIndex].audio.play();
    }, this.delay);
  }

  _getRandomIndex() {
    const randomIndex = Math.floor(Math.random() * this.cardsRegular.length);
    if (this.indexes.length === this.cardsRegular.length) {
      return this.buttonContainer.hasCrosses() ? this._endGame('loose') : this._endGame('win');
    }
    if (this.indexes.includes(randomIndex)) {
      return this._getRandomIndex();
    }
    return randomIndex;
  }

  _endGame(winOrLoose) {
    setTimeout(() => {
      this._cleanMainExceptPageName();

      const endGameContainer = document.createElement('div');
      endGameContainer.classList.add('endGame-container');
      const endGameText = document.createElement('h2');
      endGameText.style.marginBottom = '24px';
      endGameText.textContent = this.winOrLooseObject[winOrLoose];
      const endGameImage = new Image(`icons/smile-${winOrLoose}.gif`, `smile-${winOrLoose}.gif`, 280).node;
      this.audioplayer.play(winOrLoose);

      endGameContainer.append(endGameText, endGameImage);
      this.main.append(endGameContainer);

      this._forwarding();
    }, this.delay);
  }

  _forwarding() {
    setTimeout(() => {
      this._cleanMainExceptPageName();
      this._renderStartPage();
    }, this.delay * 4);
  }

  _reactToCorrectAnswer() {
    this._startGame();
    this.audioplayer.play('hey');
    this.buttonContainer.appendSign('star');
  }

  _addStatsPlay(item, type) {
    let localType = null;
    if (type === 'correct') {
      localType = 'playCorrect';
    } else localType = 'playWrong';

    let stats = null;
    if (localStorage.getItem(item.word)) {
      stats = localStorage.getItem(item.word);
      stats = JSON.parse(stats);
      stats[localType] = stats[localType] ? stats[localType] + 1 : 1;
    } else {
      stats = {};
      stats[localType] = 1;
    }
    stats = JSON.stringify(stats);
    localStorage.setItem(item.word, stats);
  }

  _reactToWrongAnswer() {
    this.audioplayer.play('wrong');
    this.buttonContainer.appendSign('cross');
  }
}
