
window.onload = function () {
    let isJump = false;
    const anotherWay = window.location.href;
    if (anotherWay.includes('index.html')) {
        isJump = true;
    }

    const user = sessionStorage.getItem('connectUser');

    if (!isJump || (isJump && !user)) {
        console.log("in if");

        let users = [];
        const loginButton = document.querySelector(".btn-login");
        const modal = document.querySelector('.modal');
        const modalContent = document.querySelector('.modal-content');
        const additionalFields = document.querySelector('#additionalFields');
        const usernameInput = document.querySelector('#username');
        const passwordInput = document.querySelector('#password');
        const usersInStorage = localStorage.getItem('users');
        if (usersInStorage) {
            users = JSON.parse(usersInStorage);
        }

        if (isJump) {
            setTimeout(() => {
                if (modal && modalContent) {
                    modal.style.visibility = 'visible';
                    usernameInput.setAttribute('required', true);
                    passwordInput.setAttribute('required', true);
                    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    modalContent.classList.add('show');
                }
            }, 2000);
        }

        loginButton.addEventListener('click', () => {
            console.log("in click");
            let i = 0;
            let foundUser = null;

            while (i < users.length && foundUser === null) {
                if (users[i].name === usernameInput.value && users[i].password === passwordInput.value) {
                    foundUser = users[i];
                }
                i++;
            }
            // console.log("foundUser " + foundUser);
            // console.log(usernameInput.value);
            // console.log(passwordInput.value);


            if (usernameInput.value && passwordInput.value) {
                if (foundUser) {
                    alert('ברוך הבא');
                    sessionStorage.setItem('connectUser', JSON.stringify(foundUser));
                    window.open("index.html");
                } else {
                    // console.log("before");

                    if (additionalFields.children.length === 0) {
                        console.log("in");

                        const emailLabel = document.createElement('label');
                        emailLabel.for = 'email';
                        emailLabel.innerText = 'כתובת מייל:';
                        additionalFields.appendChild(emailLabel);

                        const emailInput = document.createElement('input');
                        emailInput.type = 'email';
                        emailInput.id = 'email';
                        emailInput.required = true;
                        additionalFields.appendChild(emailInput);
                        additionalFields.appendChild(document.createElement('br'));

                        const cardNumberLabel = document.createElement('label');
                        cardNumberLabel.for = 'cardNumber';
                        cardNumberLabel.innerText = 'מספר כרטיס:';
                        additionalFields.appendChild(cardNumberLabel);

                        const cardNumberInput = document.createElement('input');
                        cardNumberInput.type = 'text';
                        cardNumberInput.id = 'cardNumber';
                        cardNumberInput.required = true;
                        additionalFields.appendChild(cardNumberInput);
                        additionalFields.appendChild(document.createElement('br'));

                        const expiryDateLabel = document.createElement('label');
                        expiryDateLabel.for = 'expiryDate';
                        expiryDateLabel.innerText = 'תאריך תוקף (MM/YY):';
                        additionalFields.appendChild(expiryDateLabel);

                        const expiryDateInput = document.createElement('input');
                        expiryDateInput.type = 'text';
                        expiryDateInput.id = 'expiryDate';
                        expiryDateInput.required = true;
                        additionalFields.appendChild(expiryDateInput);
                        additionalFields.appendChild(document.createElement('br'));

                        const cvvLabel = document.createElement('label');
                        cvvLabel.for = 'cvv';
                        cvvLabel.innerText = 'קוד סודי (CVV):';
                        additionalFields.appendChild(cvvLabel);

                        const cvvInput = document.createElement('input');
                        cvvInput.type = 'text';
                        cvvInput.id = 'cvv';
                        cvvInput.required = true;
                        additionalFields.appendChild(cvvInput);
                        additionalFields.appendChild(document.createElement('br'));

                        alert('אנא מלא את כל הפרטים הנדרשים להרשמה.');
                        return; // עכשיו זה ממתיו שהמשתמש יכנים את השדות החדשים
                    }


                    const email = document.querySelector('#email').value;
                    const cardNumber = document.querySelector('#cardNumber').value;
                    const expiryDate = document.querySelector('#expiryDate').value;
                    const cvv = document.querySelector('#cvv').value;


                    if (!email || !cardNumber || !expiryDate || !cvv) {
                        alert('אנא מלא את כל הפרטים הנדרשים להרשמה.');
                        return;
                    }


                    const newUser = {
                        name: usernameInput.value,
                        password: passwordInput.value,
                        email: email,
                        cardNumber: cardNumber,
                        expiryDate: expiryDate,
                        CVV: cvv,
                    };

                    users.push(newUser);

                    console.log(newUser);
                    sessionStorage.setItem('connectUser', JSON.stringify(newUser));
                    localStorage.setItem('users', JSON.stringify(users));
                    alert('אתה חדש אצלינו');
                    window.open("index.html");
                }

                if (modal && modalContent) {
                    if (usernameInput) usernameInput.removeAttribute('required');
                    if (passwordInput) passwordInput.removeAttribute('required');

                    const emailInput = document.querySelector('#email');
                    console.log(emailInput);

                    if (emailInput) emailInput.removeAttribute('required');
                    modalContent.classList.remove('show');
                    modal.style.display = 'none';

                }

                usernameInput.value = "";
                passwordInput.value = "";
            }
        });
    }
}

