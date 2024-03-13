const token = localStorage.getItem('token');
if(token){
    document.getElementById("login").classList.add("displayNone");
    document.getElementById("register").classList.add("displayNone");
    document.getElementById("logout").classList.remove("displayNone");
    document.getElementById("wellcome").innerHTML=localStorage.getItem('name');
    document.getElementById("wellcome").classList.remove("displayNone");
    document.getElementById("recipesBookContainer").classList.remove("notConnect");
    document.getElementById("recipesBook").href="./recipesBook.html";
    document.getElementById("setProfile").classList.remove("displayNone");
}
