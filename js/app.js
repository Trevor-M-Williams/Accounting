let revenue = 0;
let expenses = 0;
let transfers = 0;
let balance = 0;

setup();

function setup() {
  let data = checkForData();
  if (data) {
    handleEnter();
    configureReport(data);
  } else {
    document.querySelector("button").onclick = () => {
      handleEnter();
      handleFile();
    };
  }
}

function checkForData() {
  let data = localStorage.getItem("data");
  return data;
}

function configureReport(data) {
  let [revenueItems, expenseItems] = handleData(data);
  generateItems(revenueItems, expenseItems);
  document.querySelector(".gross-revenue").textContent =
    Math.round(revenue * 100) / 100;
  document.querySelector(".total-expenses").textContent = Math.abs(
    Math.round(expenses * 100) / 100
  );
  document.querySelector(".operating-income").textContent =
    Math.round((revenue - Math.abs(expenses)) * 100) / 100;
}

function generateItems(revenueItems, expenseItems) {
  let [revenueList, expenseList] = document.querySelectorAll(".item-list");

  revenueItems.forEach((e, i) => {
    if (!e.date) return;
    generateItem(e, revenueList);
  });

  expenseItems.forEach((e, i) => {
    if (!e.date) return;
    generateItem(e, expenseList);
  });

  function generateItem(e, list) {
    let item = document.createElement("div");
    let date = document.createElement("div");
    let name = document.createElement("div");
    let amount = document.createElement("div");
    let dateText = document.createElement("div");
    let nameText = document.createElement("div");
    let amountText = document.createElement("div");
    let amountText2 = document.createElement("div");
    item.className = "item";
    date.className = "item-date";
    name.className = "item-name";
    amount.className = "item-amount";
    dateText.className = "item-text";
    nameText.className = "item-text";
    amountText.className = "item-text";
    amountText2.className = "item-text";
    dateText.textContent = e.date.replace("2022", "22");
    nameText.textContent = getName(e.description);
    amountText.textContent = "$";
    let dollars = Math.floor(Math.abs(parseFloat(e.amount)));
    let cents = Math.abs(parseFloat(e.amount)) - dollars;
    cents = cents.toFixed(2).slice(1);
    amountText2.textContent = dollars + cents;
    date.append(dateText);
    name.append(nameText);
    amount.append(amountText, amountText2);
    item.append(date, name, amount);
    list.append(item);
  }
}

function getName(description) {
  let name = "";
  let names = [
    { keyword: "aventel", name: "Aventel Partners" },
    { keyword: "fee", name: "Chase Bank" },
    { keyword: "checking", name: "Chase Bank" },
    { keyword: "7980", name: "Credit Card Payment" },
    { keyword: "brian", name: "Denver Printer" },
    { keyword: "discount", name: "Discount Tire" },
    { keyword: "remote", name: "Earth Petroleum" },
    { keyword: "44799", name: "Earth Petroleum" },
    { keyword: "logan", name: "Logan Vallo" },
    { keyword: "property", name: "Rent" },
    { keyword: "safeway", name: "Safeway" },
    { keyword: "detox", name: "Valiant Living" },
    { keyword: "restorations", name: "Valiant Living" },
    { keyword: "bill.com", name: "Bill.com" },
  ];

  names.forEach((e) => {
    if (description.toLowerCase().includes(e.keyword)) {
      name = e.name;
    }
  });

  return name;
}

function handleData(data) {
  fileInput.style.display = "none";

  let rows = data.split("\n");
  let revenueItems = [];
  let expenseItems = [];
  let transferItems = [];

  for (let i = 1; i < rows.length; i++) {
    let row = rows[i].split(",");
    let entry = {
      details: row[0],
      date: row[1],
      description: row[2],
      amount: row[3],
      type: row[4],
    };

    let amount = parseFloat(entry.amount);
    if (!amount) continue;
    if (amount < 0) {
      if (
        entry.description.includes("Transfer") ||
        entry.description.includes("ATM WITHDRAWAL")
      ) {
        transfers += amount;
        transferItems.push(entry);
      } else {
        expenses += amount;
        expenseItems.push(entry);
      }
    } else {
      revenueItems.push(entry);
      revenue += amount;
    }
    balance += amount;
  }
  return [revenueItems, expenseItems, transferItems];
}

function handleEnter() {
  // slide overlay
  let overlay = document.querySelector(".overlay");
  overlay.classList.add("hidden");
}

function handleFile() {
  let file = fileInput.files[0];
  let reader = new FileReader();
  reader.onload = () => {
    configureReport(reader.result);
    localStorage.setItem("data", reader.result);
  };
  reader.readAsText(file);
}
