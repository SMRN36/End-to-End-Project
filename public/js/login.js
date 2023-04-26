const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
//const signUpBtn = document.getElementById("signUpBtn");
//const loginBtn = document.getElementById("loginBtn");
        
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});
signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

async function postUserSignUp() {
    const res = axios.post("http://localhost:3000/user/signUp");
  }
  
  signUpButton.addEventListener("click", postUserSignUp);