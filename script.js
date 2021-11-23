"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2021-10-15T10:17:24.185Z",
    "2021-10-19T17:01:17.194Z",
    "2021-11-18T14:11:59.604Z",
    "2021-11-19T23:36:17.929Z",
    "2021-11-21T10:51:36.790Z",
  ],
  currency: "EUR",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// adding Dates to movments
const addingDate = function (date) {
  const daysPassed = function (day1, day2) {
    let days = (Number(day1) - Number(day2)) / (1000 * 60 * 60 * 24);
    return Math.abs(Math.trunc(days));
  };
  const days = daysPassed(date, new Date());
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days <= 7) return `${days} days ago`;
  else {
    const day = String(date.getDate()).padStart(2, 0);
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

// Dispaly Movments Function
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  mov.forEach(function (mov, i) {
    const movType = mov >= 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const dateFormat = addingDate(date);
    const rowHtml = `        
    <div class="movements__row">
      <div class="movements__type movements__type--${movType}">${
      i + 1
    } ${movType} </div>
      <div class="movements__date">${dateFormat}</div> 
      <div class="movements__value">${mov.toFixed(2)} €</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", rowHtml);
  });
};

// Dispaly Balance Function
const displayBalance = function (acc) {
  const balanceACC = acc.movements.reduce((sum, mov) => (sum += mov));
  labelBalance.textContent = balanceACC.toFixed(2) + ` €`;
  acc.balance = balanceACC;
};

// Dispaly Summary Function
const displaySummary = function (acc) {
  const allIncomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = `${allIncomes.toFixed(2)}€`;
  let allOutcomes =
    acc.movements.filter((mov) => mov < 0).reduce((sum, mov) => sum + mov, 0) *
    -1;
  labelSumOut.textContent = `${allOutcomes.toFixed(2)}€`;
  const allInterest = (allIncomes * acc.interestRate) / 100;
  labelSumInterest.textContent = `${allInterest.toFixed(2)}€`;
};

// Display Current Date and Time
const displayDate = function () {
  labelDate.innerHTML = " ";
  const now = new Date();
  const locale = navigator.language;
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  labelDate.innerHTML = new Intl.DateTimeFormat(locale, options).format(now);
  // or hardcoded Static date
  // const d = new Date();
  // const day = String(d.getDate()).padStart(2, 0);
  // const month = String(d.getMonth() + 1).padStart(2, 0);
  // const year = d.getFullYear();
  // const hours = String(d.getHours()).padStart(2, 0);
  // const minutes = String(d.getMinutes()).padStart(2, 0);
  // labelDate.innerHTML = `${day}/${month}/${year}, ${hours}:${minutes}`; // 08/01/2021, 23:05
};

// Update UI Function
const updateUI = function (acc) {
  displayBalance(acc); //dispaly Balance in DOM
  displayMovements(acc); // dispaly Movments in DOM
  displaySummary(acc); // dispaly Summary in DOM
  displayDate(); // diplay current Date Time
};

// Create UserName Function
const createUserName = function (user) {
  const userName = user
    .toLowerCase()
    .split(" ")
    .map((name) => name[0])
    .join("");
  return userName;
};
// Add userNames to all accounts Function
const addUserName = function (accs) {
  accs.forEach((acc) => (acc.username = createUserName(acc.owner)));
};
addUserName(accounts); // Add userNames to all accounts.

/*---------------------------------- Event Handler ----------------------------------*/
let fAccount;
// Login Button Event
btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form from submitting to prevent reload the page.
  const username = String(inputLoginUsername.value)
    .toLocaleLowerCase()
    .trim()
    .replace(/ /g, "");
  const password = Number(inputLoginPin.value);
  fAccount = accounts.find(
    (acc) => acc.username === username && acc.pin === password
  );
  if (fAccount) {
    containerApp.style.opacity = 1; //display UI
    labelWelcome.textContent = `Good Day, ${fAccount.owner.split(" ")[0]}!`; //display welcome message
    updateUI(fAccount); // Update UI
    inputLoginUsername.classList.remove("error");
    inputLoginPin.classList.remove("error");
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur(); // lose the focus
  } else {
    inputLoginUsername.classList.add("error");
    inputLoginPin.classList.add("error");
  }
});

// Transfer Button Event
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const recieverUsername = String(inputTransferTo.value)
    .toLowerCase()
    .trim()
    .replace(/ /g, "");
  const amount = Number(inputTransferAmount.value);

  const transferTo = accounts.find((acc) => acc.username === recieverUsername);
  if (amount > 0 && amount <= fAccount.balance) {
    inputTransferAmount.classList.remove("error");
    if (transferTo && transferTo !== fAccount) {
      transferTo.movements.push(amount);
      transferTo.movementsDates.push(new Date().toISOString());
      fAccount.movements.push(amount * -1);
      fAccount.movementsDates.push(new Date().toISOString());
      updateUI(fAccount); // Update UI
      inputTransferTo.value = "";
      inputTransferAmount.value = "";
      inputTransferAmount.blur();
      inputTransferTo.classList.remove("error");
    } else {
      inputTransferTo.classList.add("error");
      console.log("enter valid username");
    }
  } else {
    inputTransferAmount.classList.add("error");
    console.log("please enter correct amount");
  }
});

// Close Account Button Event
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const username = String(inputCloseUsername.value)
    .toLowerCase()
    .trim()
    .replace(/ /g, "");
  const pin = Number(inputClosePin.value);
  if (username === fAccount.username && pin === fAccount.pin) {
    containerApp.style.opacity = 0; // Hide UI (Log Out)
    const accountIndex = accounts.indexOf(fAccount);
    accounts.splice(accountIndex, 1);
    inputCloseUsername.classList.remove("error");
    inputClosePin.classList.remove("error");
  } else {
    inputCloseUsername.classList.add("error");
    inputClosePin.classList.add("error");
  }
});

// Loan Button Event
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value); // convert to number auto
  let check = false;
  if (amount > 0) {
    fAccount.movements.forEach(function (mov) {
      if (mov >= amount * 0.1) {
        check = true;
      }
    });
  }
  if (check) {
    fAccount.movements.push(amount);
    fAccount.movementsDates.push(new Date().toISOString());
    updateUI(fAccount); // Update UI
    inputLoanAmount.value = "";
    inputLoanAmount.classList.remove("error");
  } else {
    inputLoanAmount.classList.add("error");
    console.log("Please enter valid amount");
  }
});

// Sort Button Event
let test = false;
btnSort.addEventListener("click", function (e) {
  if (!test) {
    displayMovements(fAccount, true);
    test = true;
  } else {
    displayMovements(fAccount, false);
    test = false;
  }
});
