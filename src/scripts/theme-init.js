(function () {
  var t = 'dark';
  try {
    var s = localStorage.getItem('theme');
    if (s === 'light' || s === 'dark') t = s;
  } catch (e) { /* storage bloqueado: mantém dark */ }
  document.documentElement.dataset.theme = t;
  document.documentElement.classList.remove('no-js');
})();
