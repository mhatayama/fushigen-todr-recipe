class TODRRecipeSearch {

  qlForm = document.querySelector("#searchForm");
  elSearchTextInput = document.querySelector(".search-text");
  elRemoveIcon = document.querySelector(".icon-remove");
  elMixingTab = document.querySelector(".mixing-tab");
  elMixingCounter = document.querySelector(".mixing-counter")
  elMixingTable = document.querySelector(".mixing-table");
  elMxingResult = document.querySelector("#mixing-result");
  elCraftingTab = document.querySelector(".crafting-tab");
  elCraftingCounter = document.querySelector(".crafting-counter");
  elCraftingTable = document.querySelector(".crafting-table");
  elCraftingResult = document.querySelector("#crafting-result");
  elSearchIcon = document.querySelector(".search-icon");
  elSpinnerIcon = document.querySelector(".spinner-icon");
  elHelpLink = document.querySelector("p.help");
  elModalClose = document.querySelector(".modal-close");
  elModalBackground = document.querySelector(".modal-background");

  setup() {
    this.qlForm.addEventListener("submit", this.fetchSearchResult.bind(this));
    this.elMixingTab.addEventListener("click", this.toggleTab.bind(this));
    this.elCraftingTab.addEventListener("click", this.toggleTab.bind(this));
    this.elHelpLink.addEventListener("click", this.toggleModalHelp.bind(this));
    this.elModalClose.addEventListener("click", this.toggleModalHelp.bind(this));
    this.elModalBackground.addEventListener("click", this.toggleModalHelp.bind(this));
  }

  fetchSearchResult(e) {
    e.preventDefault();
    this.elSearchTextInput.classList.remove("is-danger");

    const searchText = this.elSearchTextInput.value;
    if (searchText === "") {
      return;
    }

    this.elMxingResult.innerHTML = "";
    this.elCraftingResult.innerHTML = "";
    this.toggleSearchIcon();

    fetch(`/api/search/${encodeURI(searchText)}`)
      .then(res => {
        if (res.status != 200) {
          this.elSearchTextInput.classList.add("is-danger");
          this.toggleSearchIcon();
          return;
        }
        return res.json();
      })
      .then(json => {
        if (json.length === 0) {
          this.elSearchTextInput.classList.add("is-danger");
          this.elMixingCounter.innerHTML = "0";
          this.elCraftingCounter.innerHTML = "0";
          this.toggleSearchIcon();
          return;
        }

        const mixingResult = json.filter(row =>
          ['札', '薬', 'ス', '食', '隙', '他', '素'].includes(row.category)
        );
        const craftingResult = json.filter(row =>
          ['武', '防', '守'].includes(row.category)
        );
        this.elMixingCounter.innerHTML = mixingResult.length;
        this.elCraftingCounter.innerHTML = craftingResult.length;
        this.elMxingResult.innerHTML = mixingResult.map(this.createTableRow).join("\n");
        this.elCraftingResult.innerHTML = craftingResult.map(this.createTableRow).join("\n");

        document.querySelectorAll("td.click-search").forEach(item => {
          const itemName = item.innerHTML;
          if (itemName.includes(searchText)) {
            item.classList.add("has-background-warning");
          }
          item.addEventListener("click", this.instantClickSearch);
        });

        this.toggleSearchIcon();
      });
  }

  createTableRow(row) {
    return `<tr>
    <td>${row.category}</td>
    <td class="click-search">${row.result}</td>
    <td class="click-search">${row.item1}</td>
    <td class="click-search">${row.item2}</td>
    <td class="click-search">${row.item3}</td>
    <td class="click-search">${row.item4}</td>
    <td class="click-search">${row.item5}</td>
    <td class="click-search">${row.item6}</td>
    </tr>`
  }

  instantClickSearch(e) {
    let itemName = e.target.innerHTML;
    // Lvやrank等の追加情報の除去 例:"豊姫の扇子<br>(ジュリ扇rank3)" -> "豊姫の扇子"
    if (/\s|<br>/.test(itemName)) {
      itemName = itemName.split(/\s|<br>/)[0];
    }
    // お札の枚数を除去 例:"低速の札(3)" -> "低速の札"
    if (/(.+)\(\d+\)$/.test(itemName)) {
      itemName = /(.+)\(\d+\)$/.exec(itemName)[1];
    }

    this.elSearchTextInput.value = itemName;
    this.getSearchResult(e);
  }

  toggleTab(e) {
    if (e.target.classList.contains("mixing-tab")) {
      this.elMixingTable.classList.remove("is-hidden");
      this.elCraftingTable.classList.add("is-hidden");
      this.elMixingTab.parentElement.classList.add("is-active");
      this.elCraftingTab.parentElement.classList.remove("is-active");
    } else {
      this.elMixingTable.classList.add("is-hidden");
      this.elCraftingTable.classList.remove("is-hidden");
      this.elMixingTab.parentElement.classList.remove("is-active");
      this.elCraftingTab.parentElement.classList.add("is-active");
    }
  }

  toggleSearchIcon() {
    this.elSearchIcon.classList.toggle("is-hidden");
    this.elSpinnerIcon.classList.toggle("is-hidden");
  }

  toggleModalHelp() {
    document.querySelector('.modal').classList.toggle('is-active')
  }
}

const app = new TODRRecipeSearch()
app.setup();