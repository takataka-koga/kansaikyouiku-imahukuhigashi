let nextId = 1; // 初期の id
const correctPassword = "password"; // パスワードを定義

document.addEventListener('DOMContentLoaded', (event) => {
    loadSavedData('notificationTable4', 'notifications4');
    loadSavedData('tuitionTable4', 'tuitions4');
    loadSavedData('resultTable4', 'results4');
});

function addRow(tableId, inputId, storageKey) {
    let password = prompt("パスワードを入力してください:");
    if (password !== correctPassword) {
        alert("パスワードが正しくありません。");
        return;
    }

    let inputValue = document.getElementById(inputId).value.trim();
    
    if (inputValue === "") {
        alert("入力された内容が空です。");
        return;
    }

    let tableBody = document.getElementById(tableId).querySelector('tbody');
    let newRow = document.createElement("tr");
    newRow.id = tableId + "_row_" + nextId;

    let cell1 = document.createElement("td");
    let span = document.createElement("span");
    span.textContent = inputValue;
    cell1.appendChild(span);

    let cell2 = document.createElement("td");
    let editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = inputValue;
    editInput.classList.add("edit-input");

    let saveButton = document.createElement("button");
    saveButton.textContent = "保存";
    saveButton.onclick = function() {
        saveRow(newRow, span, editInput, tableId, storageKey);
    };
    cell2.appendChild(saveButton);

    newRow.appendChild(cell1);
    newRow.appendChild(cell2);

    tableBody.appendChild(newRow);
    nextId++;

    saveData(tableId, storageKey); // データを保存
    document.getElementById(inputId).value = ""; // 入力フィールドをクリア
}

function saveRow(row, span, editInput, tableId, storageKey) {
    let inputValue = editInput.value.trim();

    if (inputValue === "") {
        alert("保存する内容が空です。");
        return;
    }

    // テキストを更新
    span.textContent = inputValue;
    
    // 既存の保存ボタンを削除
    while (row.cells[1].firstChild) {
        row.cells[1].removeChild(row.cells[1].firstChild);
    }

    // 削除ボタンを追加
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.onclick = function() {
        let password = prompt("パスワードを入力してください:");
        if (password !== correctPassword) {
            alert("パスワードが正しくありません。");
            return;
        }

        if (confirm("この項目を削除しますか？")) {
            row.remove();
            saveData(tableId, storageKey); // データを保存
        }
    };
    row.cells[1].appendChild(deleteButton);

    saveData(tableId, storageKey); // データを保存
}

function saveData(tableId, storageKey) {
    let tableBody = document.getElementById(tableId).querySelector('tbody');
    let data = [];
    for (let row of tableBody.rows) {
        let span = row.cells[0].querySelector('span');
        if (span) {
            data.push(span.textContent);
        }
    }
    localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadSavedData(tableId, storageKey) {
    let tableBody = document.getElementById(tableId).querySelector('tbody');
    let savedData = localStorage.getItem(storageKey);
    if (savedData) {
        savedData = JSON.parse(savedData);
        for (let item of savedData) {
            let newRow = document.createElement("tr");
            newRow.id = tableId + "_row_" + nextId;

            let cell1 = document.createElement("td");
            let span = document.createElement("span");
            span.textContent = item;
            cell1.appendChild(span);

            let cell2 = document.createElement("td");
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "削除";
            deleteButton.onclick = function() {
                let password = prompt("パスワードを入力してください:");
                if (password !== correctPassword) {
                    alert("パスワードが正しくありません。");
                    return;
                }

                if (confirm("この項目を削除しますか？")) {
                    newRow.remove();
                    saveData(tableId, storageKey); // データを保存
                }
            };
            cell2.appendChild(deleteButton);

            newRow.appendChild(cell1);
            newRow.appendChild(cell2);

            tableBody.appendChild(newRow);
            nextId++;
        }
    }
}
