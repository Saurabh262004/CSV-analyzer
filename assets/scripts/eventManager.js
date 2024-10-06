let
  keyLog = {}, // to track every key if it's presed or not
  mousedown = false,
  workplaceScrolling = false,
  workplaceScrollerFPS = 60, // intervals per second
  workplaceScrollerSpeed = 8; // pxixels per interval

// keyboard shortcut controls
document.addEventListener('keydown', (event) => {
  key = event.key;
  keyLog[key] = true;

  if (keyLog['Control']) {
    if (key === 'ArrowDown') {
      footerScroll();
    } else if (key === 'ArrowRight') {
      profileConfigLoadUnload();
    }
  } else if (keyLog['Shift']) {
    if (!workplaceScrolling) {
      if (key === 'ArrowUp') {
        scrollWorkplace('up');
      } else if (key === 'ArrowDown') {
        scrollWorkplace('down');
      }
    }
  }
});

document.addEventListener('keyup', (event) => {
  let key = event.key;
  keyLog[key] = false;

  if (key === 'Shift' || key === 'ArrowUp' || key === 'ArrowDown') {
    workplaceScrolling = false;
  }
});

// click event controls
document.addEventListener('click', (event) => {
  switch (event.target.id) {
    case 'main-profile' : profileConfigLoadUnload();
      break;
    case 'profile-image' : profileConfigLoadUnload();
      break;
    case 'main-scroller' : footerScroll();
      break;
    case 'fileUpload-transpose' : toggleTransposeIndicator();
      break;
    case 'transpose-indicator' : toggleTransposeIndicator();
  }
});

// mousedown event
document.addEventListener('mousedown', (event) => {
  // console.log(event);
  let target = event.target;

  if (event.button === 0) {
    // trigger workplace scrolling
    if (!workplaceScrolling) {
      if (target.id === 'workplace-scroller-down') {
        scrollWorkplace('down');
      } else if (target.id === 'workplace-scroller-up') {
        scrollWorkplace('up');
      }
    }
  }
});

// mouseup event
document.addEventListener('mouseup', (event) => {
  // let target = event.target;

  workplaceScrolling = false;
});

// file upload change event
$('#fileUpload-input').change(() => {
  getDataFromInput(checkData);
});
