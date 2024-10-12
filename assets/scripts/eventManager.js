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
        scrollWorkplace('up', 2.5);
      } else if (key === 'ArrowDown') {
        scrollWorkplace('down', 2.5);
      }
    }
  } else {
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
    case 'profile-image-container' : profileConfigLoadUnload();
      break;
    case 'profile-image' : profileConfigLoadUnload();
      break;
    case 'main-scroller' : footerScroll();
      break;
    case 'fileUpload-transpose' : toggleTransposeIndicator();
      break;
    case 'transpose-indicator' : toggleTransposeIndicator();
      break;
    case 'sortbydata-indicator' : toggleSortByIndicator();
      break;
    case 'graphButton-single' : graphMultipleSets([currentDataIndex]);
      break;
    case 'downloadJson-button' : downloadJsonData(currentLoadedData, 2);
      break;
    case 'graphAll-button' : graphMultipleSets();
      break;
    case 'save-button' : saveCurrentData();
      break;
    default : {
      if (event.target.classList[0] === 'previousData' && event.target.classList[1] === 'slot') {
        loadPreviousData(parseInt(event.target.classList[2]));
      }
    }
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

// update currentDataIndex everytime dataIndexSelector input changes
$('#dataIndexSelector-input').change(() => {
  currentDataIndex = $('#dataIndexSelector-input')[0].value;
});

// update X and Y multipliers
$('#multiplier-X').change(() => {
  XMultiplier = map($('#multiplier-X')[0].value, 0, 100, 0.5, 2);
});

$('#multiplier-Y').change(() => {
  YMultiplier = map($('#multiplier-Y')[0].value, 0, 100, 0.5, 2);
});
