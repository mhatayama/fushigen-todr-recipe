const qlForm = document.querySelector("#searchForm");
const elSearchTextInput = document.querySelector(".search-text");
const elHelp = document.querySelector("p.help");
const elRemoveIcon = document.querySelector(".icon-remove");
const elMxingResult = document.querySelector("#mixing-result");

qlForm.addEventListener("submit", getSearchResult);
elRemoveIcon.addEventListener("click", removeText);

function getSearchResult(e) {
  e.preventDefault();

  elMxingResult.innerHTML = "";

  const searchText = elSearchTextInput.value;

  if (searchText === "") {
    return;
  }

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
        return;
      }

      elMxingResult.innerHTML = json.map(row => {
        return `<tr>
          <td>${row.result}</td>
          <td>${row.item1}</td>
          <td>${row.item2}</td>
          <td>${row.item3}</td>
          <td>${row.item4}</td>
          <td>${row.item5}</td>
          <td>${row.item6}</td>
          </tr>`
      }).join("\n");
    });
}

function removeText(e) {
  elSearchTextInput.value = "";
}