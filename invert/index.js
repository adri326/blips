
// scroll the window to the bottom
setTimeout(() => {
  window.scroll(0, document.body.clientHeight - window.innerHeight);
}, 500);


// then set the window to loaded
setTimeout(() => {
  document.body.className = "loaded";
}, 1000);
