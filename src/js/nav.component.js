import Component from './components';
import cardsData from '../assets/cardsData';

export default class Nav extends Component {
  constructor(...args) {
    super(...args);

    this.list = document.createElement('ul');

    this.burger = document.createElement('div');
    this.burger.setAttribute('id', 'menuToggle');
    this._createBurger();

    this.categoriesText = [];
    this._fetchCategories();
    this._createCategoriesHtml();
    this.list.setAttribute('id', 'menu');

    this.burger.append(this.list);
    this.node.append(this.burger);
  }

  _createBurger() {
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    this.burger.append(checkbox);

    const quantityOfElementsInBurger = 3;
    for (let i = 0; i < quantityOfElementsInBurger; i++) {
      const burgerItem = document.createElement('span');
      this.burger.append(burgerItem);
    }
  }

  _fetchCategories() {
    cardsData[0].forEach((category) => {
      this.categoriesText.push(category.categoryName);
    });
  }

  _createCategoriesHtml() {
    this.categoriesHtml = [];

    this.categoriesText.forEach((textContent) => {
      const listItem = new Component('a').node;
      listItem.setAttribute('href', '#');
      const link = new Component('li', '', textContent).node;
      link.style.whiteSpace = 'nowrap';

      link.addEventListener('click', (e) => e.preventDefault());
      listItem.append(link);
      this.list.append(listItem);
      this.categoriesHtml.push(listItem);
    });
  }
}
