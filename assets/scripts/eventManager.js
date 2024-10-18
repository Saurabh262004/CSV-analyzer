// keyboard shortcut controls
document.addEventListener('keydown', (event) => {
  key = event.key;
  keyLog[key] = true;

  let scrollSpeed = 1;

  if (keyLog['Control']) {
    if (key === 'ArrowDown') {
      footerScroll();
    } else if (key === 'ArrowRight') {
      profileConfigLoadUnload();
    }
  } else if ((key === 'ArrowUp' || key === 'ArrowDown') && !workplaceScrolling && $('#main-scroller')[0].classList[2] === 'down') {
    if (keyLog['Shift']) scrollSpeed = 2.5;
    scrollWorkplace(key, scrollSpeed);
  }
});

document.addEventListener('keyup', (event) => {
  let key = event.key;
  keyLog[key] = false;

  if (key === 'Shift' || key === 'ArrowUp' || key === 'ArrowDown') {
    workplaceScrolling = false;
  }
});

// the function that runs when the default in switch at click event is ran
const clickDefault = (event) => {
  let trg = event.target;

  if (trg.classList[1] === 'loader') {
    loadPreviousData(parseInt(trg.classList[2]));
  } else if (trg.classList[1] === 'deleteBTN') {
    deletePreviousData(parseInt(trg.classList[2]));
  } else if (trg.classList[0] === 'TextColorToggle' && trg.classList[1] === 'button') {
    if (trg.classList[3] === 'W') {
      trg.classList.remove('W');
      trg.classList.add('B');
    } else if (trg.classList[3] === 'B') {
      trg.classList.remove('B');
      trg.classList.add('W');
    }
  }
}

// click events
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
    case 'graphAll-button' : graphMultipleSets();
      break;
    case 'downloadJson-button' : downloadJsonData(currentLoadedData, 2);
      break;
    case 'save-button' : saveCurrentData();
      break;
    case 'logout-button' : confirmLogout();
      break;
    case 'logout-img' : confirmLogout();
      break;
    case 'themesApply' : saveTheme();
      break;
    case 'themesReset' : resetTheme();
      break;
    default : clickDefault(event);
  }
});

// mousedown event
document.addEventListener('mousedown', (event) => {
  // console.log(event);
  let target = event.target;

  if (event.button === 0) {
    // trigger workplace scrolling
    if (!workplaceScrolling && target.classList[0] === 'scroller') {
      scrollWorkplace(target.classList[2]);
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

// change the theme of the website when the user changes the input value of themes
$('.themeInput').change((event) => {
  let trg = event.target;
  $(`#theme-${trg.classList[1]}`)[0].style.backgroundColor = trg.value;
  setTheme(trg.classList[1], trg.value);
});

// update X and Y multipliers
$('#multiplier-X').change(() => {
  XMultiplier = map($('#multiplier-X')[0].value, 0, 100, 0.5, 2);
});

$('#multiplier-Y').change(() => {
  YMultiplier = map($('#multiplier-Y')[0].value, 0, 100, 0.5, 2);
});
