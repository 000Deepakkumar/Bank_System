'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP DATA
console.log("1st User Id= dk and PIN= 1111")
console.log("2nd User Id= rk and PIN= 2222")
console.log("3rd User Id= rd and PIN= 3333")
console.log("3rd User Id= pk and PIN= 5555")

// Data
const account1 = {
  owner: 'Deepak Kumar',
  movements: [2000, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Raj Kumar',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Rita Devi',
  movements: [200, -200, 340, -300, -20, 50, 4000, -460, 11000, -290, 500],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Deepa Kumari',
  movements: [430, 10000, 700, 50, 90, -1200, -1550, 1000],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Pooja Kumari',
  movements: [430, 1000, 700, 500, 90, -500],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const accountHistorys = function (accounts) {
  containerMovements.innerHTML = ""
  accounts.movements.forEach(function (move, key) {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      key + 1
    } ${type}</div>
        <div class="movements__value">₹${move}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html)
  });
}


const calcDisplayAmmounts = function (accounts) {
  const incomes = accounts.movements.filter(move => move > 0).reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `₹${incomes}`

  const outcome = accounts.movements.filter(move => move < 0).reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = `₹${Math.abs(outcome)}`

  const interest = Math.trunc(accounts.movements.filter(move => move > 0).map(move => (move * accounts.interestRate) / 100).reduce((acc, move) => acc + move, 0) * 100) / 100;

  labelSumInterest.textContent = `₹${interest}`

  accounts.balance = incomes + outcome + interest;
  labelBalance.textContent = `₹${accounts.balance}`
}


const createUserName = function (acces) {
  acces.forEach(function (acce) {
    acce.username = acce.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  })
}
createUserName(accounts);


let currentAccount;
let currentPin;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();//prevent refresh
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputClosePin.blur();

    accountHistorys(currentAccount)

    calcDisplayAmmounts(currentAccount)
  }
})

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  if (amount > 0 && currentAccount.balance >= amount && reciverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-1*amount);
    reciverAcc.movements.push(amount);

    accountHistorys(currentAccount)

    calcDisplayAmmounts(currentAccount)
  }
  inputTransferAmount.value = inputTransferTo.value = '';
})

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value)
  if(amount > 0 && currentAccount.movements.some(move => move >= amount * 0.1)){
    currentAccount.movements.push(amount);

    accountHistorys(currentAccount)

    calcDisplayAmmounts(currentAccount)
  }
  inputLoanAmount.value  = '';
})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex((acc) => acc.username === currentAccount.username)
    accounts.splice(index, 1)
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

setInterval(() => {
  containerApp.style.opacity = 0;
}, 1000*60*5);
  
