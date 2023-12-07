let cookie = document.getElementsByClassName('cookie')[0];
let cookieCounter = document.getElementsByClassName('cookie_counter')[0];
let clicks = parseInt(localStorage.getItem('clicks')) || 0;
let upgrade = document.getElementsByClassName('upgrade')[0];
let clicksMultiplier = parseInt(localStorage.getItem('clicksMultiplier')) || 1;
let upgradeMoney = parseInt(localStorage.getItem('upgradeMoney')) || 10;
let autoClicker = document.getElementsByClassName('autoclicker')[0];
let autoClickerTime = parseInt(localStorage.getItem('autoClickerTime')) || 1000;
let autoClickerCost = parseInt(localStorage.getItem('autoClickerCost')) || 1000;
let initialAutoClickerTime = autoClickerTime; // Preserve the initial autoClickerTime
let autoClickInterval;
let clearConfirm = document.getElementsByClassName('clearconfirm')[0];
let clearData = document.getElementsByClassName('cleardata')[0];
let cancel = document.getElementsByClassName('cancel')[0];
let confirm = document.getElementsByClassName('confirm')[0];

// Function to update localStorage values
function updateLocalStorage() {
    localStorage.setItem('clicks', clicks);
    localStorage.setItem('clicksMultiplier', clicksMultiplier);
    localStorage.setItem('upgradeMoney', upgradeMoney);
    localStorage.setItem('autoClickerTime', autoClickerTime);
    localStorage.setItem('autoClickerCost', autoClickerCost);
}

// Function to start the auto-clicker interval
function startAutoClicker() {
    autoClickInterval = setInterval(function () {
        clicks += clicksMultiplier;
        updateCookieCounter();
        updateLocalStorage();
    }, autoClickerTime); // Use autoClickerTime for the interval
}

// Function to update the UI with the current number of cookies
function updateCookieCounter() {
    cookieCounter.textContent = clicks + ' Cookies';
}

// Function to create a floating +1 element and animate it
function createPlusOneAnimation(event) {
    const plusOne = document.createElement('div');
    plusOne.textContent = '+' + clicksMultiplier;
    plusOne.classList.add('plus_one');
    document.body.appendChild(plusOne);

    const clickX = event.clientX;
    const clickY = event.clientY;

    plusOne.style.left = clickX + 'px';
    plusOne.style.top = clickY + 'px';

    setTimeout(() => {
        plusOne.style.opacity = '0';
        plusOne.style.top = (clickY - 50) + 'px'; // Move the +1 element up
    }, 50);

    setTimeout(() => {
        document.body.removeChild(plusOne); // Remove the +1 element from the DOM after animation
    }, 1000); // Adjust this time to control how long the +1 element stays visible
}

// Function to handle cookie click event
function handleCookieClick(event) {
    clicks += clicksMultiplier;
    updateCookieCounter();
    updateLocalStorage();

    createPlusOneAnimation(event);
}

// Function to handle the upgrade button click event
function handleUpgradeClick() {
    if (clicks >= upgradeMoney) {
        clicks -= upgradeMoney;
        clicksMultiplier += 1;
        upgradeMoney *= 2;
        upgrade.textContent = ('Upgrade: ' + upgradeMoney);
        updateCookieCounter();
        updateLocalStorage();
    }
}

// Function to handle the auto-clicker button click event
function handleAutoClickerClick() {
    if (clicks >= autoClickerCost) {
        clicks -= autoClickerCost;
        

        // Set the flag to indicate the auto-clicker is active
        localStorage.setItem('autoClickerActive', 'true');

        startAutoClicker(); // Start the auto-clicker interval with the current autoClickerTime
        autoClickerCost *= 2;
        
        // Increase the auto-clicker time by doubling the initial autoClickerTime
        autoClickerTime = initialAutoClickerTime * Math.pow(0.8, clicksMultiplier - 1);
        localStorage.setItem('autoClickerTime', autoClickerTime);

        autoClicker.textContent = ('Upgrade Auto Clicker: ' + autoClickerCost);
        autoClicker.style.fontSize = '25px';
        updateCookieCounter();
        updateLocalStorage();
    }
}

// Function to clear all data
function clearAllData() {
    clicks = 0;
    clicksMultiplier = 1;
    upgradeMoney = 10;
    autoClickerTime = 1000;
    autoClickerCost = 1000;

    clearInterval(autoClickInterval);
    autoClickInterval = null;

    // Clear the auto-clicker flag
    localStorage.removeItem('autoClickerActive');

    updateCookieCounter();
    upgrade.textContent = ('Upgrade: ' + upgradeMoney);
    autoClicker.textContent = ('Auto Clicker: ' + autoClickerCost);

    updateLocalStorage();
}

// Function to handle the confirmation of clearing data
function handleConfirmClick() {
    clearAllData();
    clearConfirm.style.display = 'none';

    // Restart auto-clicker if it was active before clearing data
    if (autoClickInterval) {
        startAutoClicker();
    }
}

// Function to handle cancelling the data clearing process
function handleCancelClick() {
    clearConfirm.style.display = 'none';
}

// Function to start the auto-clicker interval after page load
function initiateAutoClicker() {
    // Update the UI with initial values from localStorage
    updateCookieCounter();
    upgrade.textContent = ('Upgrade: ' + upgradeMoney);
    autoClicker.textContent = 'Upgrade Auto Clicker: ' + autoClickerCost;
    autoClicker.style.fontSize = '24px'

    const autoClickerActive = localStorage.getItem('autoClickerActive');

    // Restart auto-clicker if it was active before refreshing
    if (autoClickerActive === 'true') {
        startAutoClicker();
    }
}

// Event listener for window load to initiate auto-clicker after page load
window.addEventListener('load', initiateAutoClicker);

// Add event listeners
cookie.addEventListener('click', handleCookieClick);
upgrade.addEventListener('click', handleUpgradeClick);
autoClicker.addEventListener('click', handleAutoClickerClick);
clearData.addEventListener('click', () => {
    clearConfirm.style.display = 'flex';
});

confirm.addEventListener('click', handleConfirmClick);
cancel.addEventListener('click', handleCancelClick);
