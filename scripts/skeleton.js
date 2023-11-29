function loadSkeleton(){
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $('#navbarPlaceholder').load('./components/navbar.html');
            $('#headerPlaceholder').load('./components/header.html');
        }
    });
}
loadSkeleton();