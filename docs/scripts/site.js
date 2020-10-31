window.addEventListener('DOMContentLoaded', (event) => {
    var nit;
    (() => {
        window.clearTimeout(nit);
        nit = window.setTimeout(function () {
            console.log('This should give the body class when fully loaded');
            document.getElementsByTagName('body')[0].classList.add('loaded');
        }, 500);
    })();
});
