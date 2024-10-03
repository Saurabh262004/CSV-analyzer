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
    let
      scroller = $('#main-scroller')[0],
      profile = $('#main-profile')[0];

    if ((key === 'ArrowDown' && includes('down', scroller.classList)) || (key === 'ArrowUp' && includes('up', scroller.classList))) {
      footerScroll();
    } else if ((key === 'ArrowRight' && !includes('active', profile.classList)) || (key === 'ArrowLeft' && includes('active', profile.classList))) {
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
$('#file-upload-input').change(() => {
  $('.option.lable._1')[0].innerHTML = $('#file-upload-input')[0].files[0].name;
});

// handle scrolling up or down in the workplace
const scrollWorkplace = (direction) => {
  if (direction === 'up') {
    workplaceScrolling = true;

    let workplaceScrollerInterval = window.setInterval(() => {
      if (!workplaceScrolling) {
        clearInterval(workplaceScrollerInterval);
      }

      let
        workplace = $('#graph-container-inner-box')[0],
        workplaceTop = workplace.getClientRects()[0].top,
        headerHeight = $('#main-header')[0].getClientRects()[0].height;

      if (workplaceTop >= headerHeight) {
        workplace.style.setProperty('top', `0`);
        workplaceScrolling = false;
      } else {
        workplace.style.setProperty('top', `${(workplaceTop - headerHeight) + workplaceScrollerSpeed}px`);
      }

      if (!workplaceScrolling) {
        clearInterval(workplaceScrollerInterval);
      }
    }, workplaceScrollerFPS/1000);
  } else if (direction === 'down') {
    workplaceScrolling = true;

    let workplaceScrollerInterval = window.setInterval(() => {
      if (!workplaceScrolling) {
        clearInterval(workplaceScrollerInterval);
      }

      let
        workplace = $('#graph-container-inner-box')[0],
        workplaceHeight = workplace.getClientRects()[0].height,
        workplaceTop = workplace.getClientRects()[0].top,
        workplaceBottom = workplace.getClientRects()[0].bottom,
        headerHeight = $('#main-header')[0].getClientRects()[0].height;

      if (Math.round(workplaceBottom) <= window.visualViewport.height) {
        workplace.style.setProperty('top', `${-(workplaceHeight - $('#main-content')[0].getClientRects()[0].height)}px`);
        workplaceScrolling = false;
      } else {
        workplace.style.setProperty('top', `${(workplaceTop - headerHeight) - workplaceScrollerSpeed}px`);
      }

      if (!workplaceScrolling) {
        clearInterval(workplaceScrollerInterval);
      }
    }, workplaceScrollerFPS/1000);
  } else {
    console.error(`Received invalid value for \`direciton\`.\nExpected: 'down' or 'up'\nReceived: '${direction}'`);
  }
}
