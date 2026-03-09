const input = document.getElementById("task-input"); //Henter tekstfelt
const btn = document.getElementById("add-btn");      //Henter knapp
const list = document.getElementById("task-list");   //Henter listen

btn.addEventListener('click', function() {
    const text = input.value.trim();
    if (text === "") return; //Avbryter hvis feltet er tomt

    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
    input.value = "";
})