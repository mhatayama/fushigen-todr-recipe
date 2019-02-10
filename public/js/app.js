const qlForm = document.querySelector("#searchForm");
const elSearchTextInput = document.querySelector(".search-text");
const elHelp = document.querySelector("p.help");
const elRemoveIcon = document.querySelector(".icon-remove");
const elMixingCounter = document.querySelector(".mixing-counter")
const elMxingResult = document.querySelector("#mixing-result");

qlForm.addEventListener("submit", getSearchResult);

function getSearchResult(e) {
  e.preventDefault();

  elSearchTextInput.classList.remove("is-danger");
  elHelp.innerHTML = "アイテム名を入力してください。";

  const searchText = elSearchTextInput.value;

  if (searchText === "") {
    return;
  }

  elMxingResult.innerHTML = "";

  fetch(`/api/search/${encodeURI(searchText)}`)
    .then(res => {
      if (res.status != 200) {
        elSearchTextInput.classList.add("is-danger");
        elHelp.innerHTML = "問題が発生しました。";
      }
      return res.json();
    })
    .then(json => {
      elMixingCounter.innerHTML = json.length;

      if (json.length === 0) {
        elSearchTextInput.classList.add("is-danger");
        elHelp.innerHTML = "結果が見つかりませんでした。";
        return;
      }

      elMxingResult.innerHTML = json.map(row => {
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
      }).join("\n");

      document.querySelectorAll("td.click-search").forEach(item => {
        const itemName = item.innerHTML;
        if (searchText === itemName) {
          item.classList.add("has-background-warning");
        }
        item.addEventListener("click", instantClickSearch);
      });
    });
}

function instantClickSearch(e) {
  let itemName = e.target.innerHTML;
  if (itemName.includes("<br>")) {
    itemName = itemName.split("<br>")[0];
  }
  if (/(.+)\(\d+\)$/.test(itemName)) {
    itemName = /(.+)\(\d+\)$/.exec(itemName)[1];
  }

  elSearchTextInput.value = itemName;
  getSearchResult(e);
}