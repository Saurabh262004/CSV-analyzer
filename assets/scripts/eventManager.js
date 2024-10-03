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
$('#fileUpload-input').change(() => {
  let file = $('#fileUpload-input')[0].files[0];

  if (file.type !== 'text/csv') {
    customAlert.alert('invalidFileType');
    console.error("Please upload a .csv file");
    return false;
  }

  let reader = new FileReader();

  reader.readAsText(file, 'UTF-8');

  reader.onload = (event) => {
    $('.fileUpload.label')[0].innerHTML = file.name;
    jsonData = csvToJson(event.target.result);
    $('#dataSetDisplay-noDisplay')[0].innerHTML = jsonData.length-1;
    // console.log(event);
  };
});
