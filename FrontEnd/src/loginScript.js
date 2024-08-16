const apiUrl = 'http://localhost:5678/api';
var token;
let index;

const loginForm = document.getElementById('loginForm')

if (loginForm) {
    loginForm.addEventListener('submit', function(event)  {
        event.preventDefault();
        let logs = getLogin()
        verifyLogin(logs);
    });
}

function getLogin(){
    let email = document.getElementById("email").value;
    let password = document.getElementById('password').value;
    return new Login(email,password)
}

async function verifyLogin(login){
    try {
        let response = await fetch(`${apiUrl}/users/login`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(login.toDictionary())
        })
        if (response.ok) {
            token = await response.json();
            localStorage.setItem("token", JSON.stringify(token));
            window.location.href = "editpage.html"
        }
        else {
            showErrorMessage()
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function showErrorMessage() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "block";
}
       
class Login{
    constructor(email,password){
        this.email = email
        this.password = password
    }

    toDictionary(){
        return {
            'email': this.email,
            'password': this.password
        };
    }
}
