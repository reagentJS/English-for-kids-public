import Component from './components';
import cardsData from '../assets/cardsData';
import TableHeader from './table/tableHeader';
import TableRow from './table/tableRow';
import TableData from './table/tableData';

export default class Statistics {
  constructor() {
    this._createButtons();

    this.tableHeaders = [
      '№',
      'Word',
      'Translation',
      'Clicks\r\n(train)',
      'Correct',
      'Wrong',
      '%',
    ];
    this._createTable();
    this._appendTableHead();
    this._appendTableBody();

    this.node = new Component('div', 'container-stats').node;
    this.node.append(this.buttonStats, this.table);
  }

  _createButtons() {
    this.buttonStats = new Component('div', 'button-container').node;
    this.buttonStats.innerHTML = `
   
      <form name="my" class="form">
        <span>Sort:</span>
        <select name="sort" class="select">
          <option value="default" selected>default</option>
          <option value="word up">by word &#8595;</option>
          <option value="word down">by word &#8593;</option>
          <option value="translation up">by translation &#8595;</option>
          <option value="translation down">by translation &#8593;</option>
          <option value="clicksTrain down">by clicks (train) &#8595;</option>
          <option value="clicksTrain up">by clicks (train) &#8593;</option>
          <option value="correct down">by correct answers &#8595;</option>
          <option value="correct up">by correct answers &#8593;</option>
          <option value="wrong down">by wrong answers &#8595;</option>
          <option value="wrong up">by wrong answers &#8593;</option>
          <option value="% down">% &#8595;</option>
          <option value="% up">% &#8593;</option>
        </select>
        <button id="load" class="button__stats stats-load" type="submit">Load</button>
      </form>

    `;

    this.resetStats = new Component('button', 'button__stats stats-reset', 'Reset statistics').node;
    this.buttonStats.append(this.resetStats);
  }

  addListenersForSorting(loadButton) {
    const form = document.forms.my;

    loadButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (this.optionsString === form.sort.value) {
        return;
      }
      this.optionsString = form.sort.value;

      if (form.sort.value !== 'default') {
        if (!this.isDeletedHeaders) {
          this._removeHeadersAndIndents();
        }
        this._sort(...this.optionsString.split(' '));
      }
    });
  }

  _removeHeadersAndIndents() {
    this.isDeletedHeaders = true;
    const arr = this.tbody.childNodes;
    arr.forEach((item) => {
      if (item.tagName.toLowerCase() === 'th') {
        this.tbody.removeChild(item);
      } else if (item.childNodes[0].classList.contains('last-row')) {
        item.childNodes.forEach((td) => {
          td.classList.remove('last-row');
        });
      }
    });
  }

  _sort(column, upOrDown) {
    const arr = this.tbody.childNodes;
    const len = arr.length;
    const columns = {
      word: 1,
      translation: 2,
      clicksTrain: 3,
      correct: 4,
      wrong: 5,
      '%': 6,
    };
    const columnLocal = columns[column];

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (upOrDown === 'up') {
          if (arr[j].childNodes[columnLocal].textContent.toLowerCase()
            > arr[j + 1].childNodes[columnLocal].textContent.toLowerCase()) {
            arr[j + 1].after(arr[j]);
          }
        } else if (arr[j].childNodes[columnLocal].textContent.toLowerCase()
          < arr[j + 1].childNodes[columnLocal].textContent.toLowerCase()) {
          arr[j + 1].after(arr[j]);
        }
      }
    }
  }

  _createTable() {
    this.table = document.createElement('table');
    this.table.classList.add('table');
  }

  _appendTableHead() {
    const tr = new TableRow();
    this.tableHeaders.forEach((tableHeader) => {
      const tableHeaderNode = new TableHeader(tableHeader);

      if (tableHeader === 'Word' || tableHeader === 'Translation') {
        tableHeaderNode.style.width = '30%';
      } else tableHeaderNode.style.width = '10%';

      if (tableHeader === 'Clicks\r\n(train)') {
        tableHeaderNode.style.whiteSpace = 'pre';
      }

      tr.append(tableHeaderNode);
    });

    const thead = document.createElement('thead');
    thead.append(tr);
    this.table.append(thead);
  }

  _appendTableBody() {
    this.tbody = document.createElement('tbody');

    let namesCounter = 0;
    for (let categoryIndex = 0; categoryIndex < cardsData[0].length; categoryIndex++) {
      if (cardsData[0][categoryIndex].categoryName !== 'Start Page'
        && cardsData[0][categoryIndex].categoryName !== 'Statistics') {
        const categoryName = new TableHeader(cardsData[0][categoryIndex].categoryName);
        categoryName.setAttribute('colspan', this.tableHeaders.length);
        categoryName.classList.add('table-category');
        this.tbody.append(categoryName);

        cardsData[categoryIndex].forEach((item, index) => {
          namesCounter += 1;
          const tableRow = this._fetchStatistics(item, namesCounter);

          if (index === cardsData[categoryIndex].length - 1) {
            tableRow.childNodes.forEach((child) => {
              child.classList.add('last-row');
            });
          }

          this.tbody.append(tableRow);
        });
      }
    }

    this.table.append(this.tbody);
  }

  _fetchStatistics(item, namesCounter) {
    const tableRow = new TableRow();
    const dataNumber = new TableData(namesCounter);
    const dataWord = new TableData(item.word);
    const dataTranslation = new TableData(item.translation);

    const stats = localStorage.getItem(item.word);
    const { trainClicks = 0, playCorrect = 0, playWrong = 0 } = JSON.parse(stats)
      ? JSON.parse(stats) : [0, 0, 0];
    const playEfficiency = this._calcEfficiency(playCorrect, playWrong);

    const dataClicks = new TableData(trainClicks);
    const dataCorrect = new TableData(playCorrect);
    const dataWrong = new TableData(playWrong);
    const dataEfficiency = new TableData(playEfficiency);

    tableRow.append(dataNumber, dataWord, dataTranslation);
    tableRow.append(dataClicks, dataCorrect, dataWrong, dataEfficiency);

    return tableRow;
  }

  _calcEfficiency(playCorrect, playWrong) {
    let playEfficiency = '-';
    if (playCorrect || playWrong) {
      playEfficiency = playCorrect / (playCorrect + playWrong);
      playEfficiency = (playEfficiency * 100).toFixed(1);
      playEfficiency = `${playEfficiency.toString()}%`;
    }
    return playEfficiency;
  }
}
