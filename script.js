"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
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
    "2021-11-24T10:51:36.790Z",
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

//************** Helpful Functions
// adding Formated Dates to movments
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
    const locale = navigator.language;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// Format Numbers
const formatNumbers = function (num, curr) {
  const locale = navigator.language;
  const options = {
    style: "currency",
    currency: curr,
  };
  return new Intl.NumberFormat(locale, options).format(num);
};

//************** UPDATE UI Functions
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
      <div class="movements__value">${formatNumbers(mov, acc.currency)}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", rowHtml);
  });
};

// Dispaly Balance Function
const displayBalance = function (acc) {
  const balanceACC = acc.movements.reduce((sum, mov) => (sum += mov));
  labelBalance.textContent = formatNumbers(balanceACC, acc.currency);
  acc.balance = balanceACC;
};

// Dispaly Summary Function
const displaySummary = function (acc) {
  const allIncomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = `${formatNumbers(allIncomes, acc.currency)}`;
  let allOutcomes =
    acc.movements.filter((mov) => mov < 0).reduce((sum, mov) => sum + mov, 0) *
    -1;
  labelSumOut.textContent = `${formatNumbers(allOutcomes, acc.currency)}`;
  const allInterest = (allIncomes * acc.interestRate) / 100;
  labelSumInterest.textContent = `${formatNumbers(allInterest, acc.currency)}`;
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

//**************************************************************************
//**************************************************************
//***************************************************
//************************************
//*************************
//**************
//********
//****
// Update UI Function
const updateUI = function (acc) {
  displayBalance(acc); //dispaly Balance in DOM
  displayMovements(acc); // dispaly Movments in DOM
  displaySummary(acc); // dispaly Summary in DOM
  displayDate(); // diplay current Date Time in DOM
};
//**************************************************************************
//**************************************************************
//***************************************************
//************************************
//*************************
//**************
//********
//****

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

// Start Logout Timer
const startLogoutTimer = function (t) {
  let time = t * 60; // convert minutes to seconds
  // tick ()
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, "0");
    let sec = String(time % 60).padStart(2, "0");
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    time--;
  };
  // call tick() every 1 second
  tick(); // because timer will start after 1 second
  const timer = setInterval(tick, 1000);
  return timer;
};

//*********************** Events Functions
let fAccount, timer;
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
    if (timer) {
      clearInterval(timer);
    } // clear any old timers
    timer = startLogoutTimer(10); //Start new timer 10 minutes
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
  // Reset Logout Timer
  clearInterval(timer);
  timer = startLogoutTimer(10); //Start new timer 10 minutes
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
    labelWelcome.textContent = `Log in to get started`;
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
    setTimeout(() => {
      fAccount.movements.push(amount);
      fAccount.movementsDates.push(new Date().toISOString());
      updateUI(fAccount); // Update UI
    }, 3000);
    inputLoanAmount.value = "";
    inputLoanAmount.classList.remove("error");
  } else {
    inputLoanAmount.classList.add("error");
    console.log("Please enter valid amount");
  }
  // Reset Logout Timer
  clearInterval(timer);
  timer = startLogoutTimer(10); //Start new timer 10 minutes
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
  // Reset Logout Timer
  clearInterval(timer);
  timer = startLogoutTimer(10); //Start new timer 10 minutes
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*-------------------------------------------------------------------------*/

/* Start Converting and Checking numbers*/

// console.log(23 === 23.0);
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);
// console.log("");

// // Conversion
// console.log(Number("22"));
// console.log(+"22");
// console.log("");

// //Parsing - take the number in first only from the string
// console.log(Number.parseInt("100px", 10)); //  base 10 for normal numbers and 2 for binary numbers
// console.log(Number.parseInt("0101hg", 2));
// console.log(Number.parseInt("xx100px"));
// console.log(Number.parseInt("xx100"));
// console.log(Number.parseInt("2.55"));
// console.log("");
// console.log(Number.parseFloat("2.55rgr")); // Float Numbers
// console.log("");

// // Checking if the value is a number
// console.log(Number.isFinite("25"));
// console.log(Number.isFinite(25));
// console.log(Number.isFinite(Number("44")));
// console.log(Number.isFinite(Number("44xx")));
// console.log("");

/* End Converting and Checking numbers*/

/*-------------------------------------------------------------------------*/

/* Strat Math and Rounding */

// console.log(Math.sqrt(9));
// console.log(Math.max(14, 25, 88, 99, 1));
// console.log(Math.min(14, 25, 88, 99, 1));
// console.log("");
// console.log(Math.random()); // generate random numbers from 0 to 1
// console.log(Math.random() * 6); // generate random numbers from 1 to 5 with decimals numbers
// console.log(Math.trunc(Math.random() * 6) + 1); // generate random numbers from 1 to 6 without decimals
// console.log("");

// //create function that generate random number between any two numbers
// const randomInt = function (min, max) {
//   const N = Math.trunc(Math.random() * (max - min) + 1) + min;
//   return N;
// };
// console.log(randomInt(2, 6));
// console.log("");

// // Rounding Integers
// console.log(Math.trunc(22.35)); // delete any fraction
// console.log(Math.trunc(22.95));
// console.log("");
// console.log(Math.round(22.35)); // round to nearest integer number
// console.log(Math.round(22.95));
// console.log("");
// console.log(Math.ceil(22.35)); // round UP number
// console.log(Math.ceil(22.95));
// console.log("");
// console.log(Math.floor(22.35)); // round down number
// console.log(Math.floor(22.95));
// console.log("");

// // Rounding Decimals .77777
// console.log((7.7777).toFixed(2)); // return String value
// console.log(Number((7.7777).toFixed(2)));
// console.log((7.7777).toFixed(1));
// console.log((7.7777).toFixed(0));

/* End Math and Rounding */

/*-------------------------------------------------------------------------*/

/* Strat BigInt */

// // Max Number can represented by Integer
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// // Use (n) in the last of number to convert it to bigInt
// console.log(4556699522255528875522455);
// console.log(4556699522255528875522455n);
// let hugeNumber = 4556699522255528875522455n;
// console.log(typeof hugeNumber);
// console.log(BigInt(45566995)); // convert int to BigInt
// console.log("");

// // Operations
// console.log(20n * 20n);
// console.log(555555555554488999998887999999n * 1000n);
// const huge = 4444488899665522156654525522n;
// const tiny = 1000;
// // console.log(huge * tiny); // Error Cannot mix BigInt and other types
// console.log(huge * BigInt(tiny));
// console.log("");

// console.log(20n > 15); // normal
// console.log(20n < 15);
// console.log(20n === 20); // === not making type convertion
// console.log(20n == 20); // == make a type convertion first to same type
// console.log(20n == "20");
// console.log(10n / 3n); // always cut off the decimal

// // Math class cannot work with BigInt numbers.

/* Strat BigInt */

/*-------------------------------------------------------------------------*/

/* Start Creating Dates */

// const myDate = new Date(); // Create an Object from Date Class
// console.log(myDate);
// console.log(myDate.toDateString());
// const [year, month, day] = [
//   myDate.getFullYear(),
//   myDate.getMonth(),
//   myDate.getDate(),
// ];
// const [hour, minute, second] = [
//   myDate.getHours(),
//   myDate.getMinutes(),
//   myDate.getSeconds(),
// ];
// console.log(year, month, day);
// console.log(hour, minute, second);
// console.log("");

// // new Date(date string)
// console.log(account1.movementsDates[0]); // ISOString Format
// console.log(new Date(account1.movementsDates[0]));
// console.log("");

// // new Date(year,month,day,hours,minutes,seconds)
// console.log(new Date(2030, 6, 13, 12, 30, 0));
// console.log(new Date(2030, 6, 13, 12, 30, 0).toISOString());
// console.log(new Date(2030, 6, 13, 12, 30, 0).toDateString());
// console.log("");

// // new Date(milisecond)
// // beging at 1970
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); // after 3 days in milisecond
// console.log(new Date().getTime()); // get number of milisecond pased from 1970
// console.log(new Date(1637267954989));

/* End Creating Dates */

/*-------------------------------------------------------------------------*/

/* Start Operations With Dates */

// const future = new Date(2030, 6, 13, 12, 30, 0);
// console.log(future.getTime()); // convert date to miliseconds
// console.log(Number(future)); // convert date to miliseconds also

// const daysPassed = function (day1, day2) {
//   let days = (Number(day1) - Number(day2)) / (1000 * 60 * 60 * 24);
//   return Math.abs(Math.trunc(days));
// };
// const day1 = new Date();
// const day2 = new Date(2021, 10, 18, 0, 0, 0);
// console.log(daysPassed(day1, day2));

/* End Operations With Dates */

/*-------------------------------------------------------------------------*/

// Internationalization API => provides language sensitive string comparison, number formatting, and date and time formatting.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl

/* Start Internationalizing Dates (Intl) */

// console.log(new Intl.DateTimeFormat("ar-SY").format(new Date()));
// console.log(new Intl.DateTimeFormat("en-BG").format(new Date()));
// console.log(new Intl.DateTimeFormat("en-US").format(new Date()));
// console.log(new Intl.DateTimeFormat("en-UK").format(new Date()));
// console.log(new Intl.DateTimeFormat("ar-EG").format(new Date()));
// console.log("");

// const now = new Date();
// const locale = navigator.language; // get user browser language
// console.log(locale);
// console.log(new Intl.DateTimeFormat(locale).format(now));
// console.log("");

// // add time (hours:minutes) by using options object
// const options = {
//   hour: "numeric",
//   minute: "numeric",
//   day: "numeric",
//   month: "long",
//   year: "numeric",
//   weekday: "long",
// };
// console.log(new Intl.DateTimeFormat(locale, options).format(now));
// console.log("");

/* End Internationalizing Dates (Intl) */

/*-------------------------------------------------------------------------*/

/* Start Internationalizing Numbers (Intl) */

// const n = 25952.59;
// console.log(new Intl.NumberFormat("en-US").format(n));
// console.log(new Intl.NumberFormat("de-DE").format(n));
// console.log(new Intl.NumberFormat("ar-EG").format(n));
// const locale = navigator.language;
// console.log(new Intl.NumberFormat(locale).format(n));
// console.log("");

// // add currency icon by using options object
// const options = {
//   style: "currency",
//   currency: "EUR",
// };
// console.log(new Intl.NumberFormat("en-US", options).format(n));
// console.log(
//   new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(
//     n
//   )
// );
// console.log(
//   new Intl.NumberFormat("USD", { style: "currency", currency: "USD" }).format(n)
// );

/* End Internationalizing Numbers (Intl) */

/*-------------------------------------------------------------------------*/

/* Start Timers */

// setTimeout (function, milliseconds) - Run once when the timer finish
// console.log("hello");
// setTimeout(() => {
//   console.log("DONE Done dOnE DonE");
// }, 2000);
// console.log("Waiting....");
// console.log("Waiting....");
// console.log("Waiting....");
// console.log("");

// setTimeout(
//   (name) => {
//     console.log(`Hello ${name}`);
//   },
//   5000,
//   "Mina"
// );
// console.log("");

// setInterval(function, milliseconds) - Runs forever until we stop it
// setInterval(() => {
//   const now = new Date();
//   // const hours = String(now.getHours()).padStart(2, "0");
//   // const minutes = String(now.getMinutes()).padStart(2, "0");
//   // const seconds = String(now.getSeconds()).padStart(2, "0");
//   // console.log(`${hours}:${minutes}:${seconds}`);
//   const locale = navigator.language;
//   const options = {
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//   };
//   console.log(new Intl.DateTimeFormat(locale, options).format(now));
// }, 1000);

/* End Timers */

/*-------------------------------------------------------------------------*/
