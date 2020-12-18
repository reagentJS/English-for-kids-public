import Component from './components';
import Render from './render';

export default class App {
  constructor() {
    this.body = document.querySelector('body');
    this.wrapper = new Component('div', 'wrapper').node;

    this.header = new Component('header', 'header').node;
    this.main = new Component('main', 'main').node;
    this.footer = new Component('footer', 'footer').node;

    this.toggle = new Component('label', 'toggle').node;
    this.state = 'train';
    this._addListenerToToggle();
    this.toggleContainer = new Component('div', 'toggle-container').node;
    this.toggleContainer.append('Train', this.toggle, 'Play');
  }

  init() {
    this.wrapper.append(this.header, this.main, this.footer);
    this.body.append(this.wrapper);

    this.render = new Render();
    const title = new Component('h1', '', 'English for kids').node;
    this.header.append(this.render.nav, title, this.toggleContainer);
    this.render.navObject.categoriesHtml[0].click(); // imitate click by start page

    this._addListenerToDocument();
  }

  _addListenerToToggle() {
    this.toggle.addEventListener('click', () => {
      if (this.toggle.childNodes[0].checked) {
        this.state = 'play';
      } else {
        this.state = 'train';
      }
      this._changeRenderState();
    });
  }

  _addListenerToDocument() {
    document.addEventListener('click', (e) => {
      if (this.render.navObject.burger.childNodes[0].checked) {
        if (e.target !== this.render.nav && !this.render.nav.contains(e.target)) {
          this.render.navObject.burger.childNodes[0].checked = false;
          e.stopPropagation();
        }
      }
    }, { capture: true });
  }

  _changeRenderState() {
    if (this.state === 'train') {
      this.render.setStateTrain();
    } else {
      this.render.setStatePlay();
    }
  }
}
