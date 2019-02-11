const qlForm = document.querySelector("#searchForm");
const elSearchTextInput = document.querySelector(".search-text");
const elHelp = document.querySelector("p.help");
const elRemoveIcon = document.querySelector(".icon-remove");
const elMixingTab = document.querySelector(".mixing-tab");
const elMixingCounter = document.querySelector(".mixing-counter")
const elMixingTable = document.querySelector(".mixing-table");
const elMxingResult = document.querySelector("#mixing-result");
const elCraftingTab = document.querySelector(".crafting-tab");
const elCraftingCounter = document.querySelector(".crafting-counter");
const elCraftingTable = document.querySelector(".crafting-table");
const elCraftingResult = document.querySelector("#crafting-result");

qlForm.addEventListener("submit", getSearchResult);
elMixingTab.addEventListener("click", clickTab);
elCraftingTab.addEventListener("click", clickTab);

function getSearchResult(e) {
  e.preventDefault();

  elSearchTextInput.classList.remove("is-danger");
  elHelp.innerHTML = "アイテム名を入力してください。";

  const searchText = elSearchTextInput.value;

  if (searchText === "") {
    return;
  }

  elMxingResult.innerHTML = "";
  elCraftingResult.innerHTML = "";

  fetch(`/api/search/${encodeURI(searchText)}`)
    .then(res => {
      if (res.status != 200) {
        elSearchTextInput.classList.add("is-danger");
        elHelp.innerHTML = "問題が発生しました。";
      }
      return res.json();
    })
    .then(json => {
      if (json.length === 0) {
        elSearchTextInput.classList.add("is-danger");
        elHelp.innerHTML = "結果が見つかりませんでした。";
        elMixingCounter.innerHTML = "0";
        elCraftingCounter.innerHTML = "0";
        return;
      }

      mixingResult = json.filter(row => 
        ['札', '薬', 'ス', '食', '隙', '他', '素'].includes(row.category)
      );
      craftingResult = json.filter(row => 
        ['武', '防', '守'].includes(row.category)
      );
      elMixingCounter.innerHTML = mixingResult.length;
      elCraftingCounter.innerHTML = craftingResult.length;
      elMxingResult.innerHTML = mixingResult.map(createTableRow).join("\n");
      elCraftingResult.innerHTML = craftingResult.map(createTableRow).join("\n");

      document.querySelectorAll("td.click-search").forEach(item => {
        const itemName = item.innerHTML;
        if (itemName.includes(searchText)) {
          item.classList.add("has-background-warning");
        }
        item.addEventListener("click", instantClickSearch);
      });
    });
}

function createTableRow(row) {
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

function instantClickSearch(e) {
  let itemName = e.target.innerHTML;
  // Lvやrank等の追加情報の除去 例:"豊姫の扇子<br>(ジュリ扇rank3)" -> "豊姫の扇子"
  if (/\s|<br>/.test(itemName)) {
    itemName = itemName.split(/\s|<br>/)[0];
  }
  // お札の枚数を除去 例:"低速の札(3)" -> "低速の札"
  if (/(.+)\(\d+\)$/.test(itemName)) {
    itemName = /(.+)\(\d+\)$/.exec(itemName)[1];
  }

  elSearchTextInput.value = itemName;
  getSearchResult(e);
}

function clickTab(e) {
  if (e.target.classList.contains("mixing-tab")) {
    elMixingTable.classList.remove("is-hidden");
    elCraftingTable.classList.add("is-hidden");
    elMixingTab.parentElement.classList.add("is-active");
    elCraftingTab.parentElement.classList.remove("is-active");
  } else {
    elMixingTable.classList.add("is-hidden");
    elCraftingTable.classList.remove("is-hidden");
    elMixingTab.parentElement.classList.remove("is-active");
    elCraftingTab.parentElement.classList.add("is-active");
  }
}