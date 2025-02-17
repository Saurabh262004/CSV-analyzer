// animate scrolling from one point to another in a linear motion
const scrollAnim = (x, y, ms, callBack) => {
  let
    intervalSpeed = 10,
    intervalPart = 1,
    totalIntervals = (ms / intervalSpeed),
    Xstep = (x - window.visualViewport.pageLeft) / totalIntervals,
    Ystep = (y - window.visualViewport.pageTop) / totalIntervals;

  let scrollAnimInterval = window.setInterval(() => {
    window.scrollTo(window.visualViewport.pageLeft + Xstep, window.visualViewport.pageTop + Ystep);
    intervalPart++;

    if (intervalPart >= totalIntervals) {
      clearInterval(scrollAnimInterval);
      callBack();
    }
  }, intervalSpeed);
}

// adds/removes class name 'active' to profile config window
const profileConfigLoadUnload = () => {
  if (includes('active', profile.classList)) {
    profileConfig.classList.remove('active');
    profile.classList.remove('active');
  } else {
    profileConfig.classList.add('active');
    profile.classList.add('active');
  }
}

// handle scrolling up or down in the workplace
const scrollWorkplace = (direction, speedMultiplier=1) => {
  if (direction === 'ArrowUp' || direction === 'up') {
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
        workplace.style.setProperty('top', `${(workplaceTop - headerHeight) + (workplaceScrollerSpeed * speedMultiplier)}px`);
      }

      if (!workplaceScrolling) {
        clearInterval(workplaceScrollerInterval);
      }
    }, workplaceScrollerFPS/1000);
  } else if (direction === 'ArrowDown' || direction === 'down') {
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
        workplace.style.setProperty('top', `${(workplaceTop - headerHeight) - (workplaceScrollerSpeed * speedMultiplier)}px`);
      }

      if (!workplaceScrolling) {
        clearInterval(workplaceScrollerInterval);
      }
    }, workplaceScrollerFPS/1000);
  } else {
    console.error(`Received invalid value for \`direciton\`.\nExpected: 'down' or 'up'\nReceived: '${direction}'`);
  }
}

// scroll user to and from footer
const footerScroll = () => {
  let
    scroller = $('#main-scroller')[0],
    scrollerClassList = scroller.classList;

  if (!footerScrollBlocked) {
    if (includes('down', scrollerClassList)) {
      footerScrollBlocked = true;
      scrollAnim(0, $('#main-footer')[0].getClientRects()[0].height, footerScrollSpeed, () => {footerScrollBlocked = false});
      scrollerClassList.remove('down');
      scrollerClassList.add('up');
      scroller.innerHTML = 'Close';
    } else {
      footerScrollBlocked = true;
      scrollAnim(0, 0, footerScrollSpeed, () => {footerScrollBlocked = false});
      scrollerClassList.add('down');
      scrollerClassList.remove('up');
      scroller.innerHTML = 'Show Footer';
    }
  }
}

// change transpose button states
const toggleTransposeIndicator = () => {
  let transposeIndicatorClassList = $('#transpose-indicator')[0].classList;

  if (includes('off', transposeIndicatorClassList)) {
    transposeIndicatorClassList.remove('off');
    transposeIndicatorClassList.add('on');
  } else {
    transposeIndicatorClassList.remove('on');
    transposeIndicatorClassList.add('off');
  }
}

// change the sorting of datasets between types/sets
const toggleSortByIndicator = () => {
  let
    indicator = $('#sortbydata-indicator')[0],
    datasetNoDisplay = $('#dataSetDisplay-noDisplay')[0],
    datasetInput = $('#dataIndexSelector-input')[0];

  if (sortbydata === 'sets') {
    if (dataLoaded) {
      dataSetsLength = currentLoadedData.info.totalDatatypes;
    }

    indicator.innerHTML = 'Sort By Types';
    sortbydata = 'types';
  } else {
    if (dataLoaded) {
      dataSetsLength = currentLoadedData.info.totalDatasets;
    }
    
    indicator.innerHTML = 'Sort By Sets';
    sortbydata = 'sets';
  }

  if (dataLoaded) {
    datasetNoDisplay.innerHTML = dataSetsLength;
    datasetInput.max = dataSetsLength;
    datasetInput.value = 1;
    currentDataIndex = 1;
  }
}

// graph multiple sets of data by given data indices
const graphMultipleSets = (dataIndices=false) => {
  if (!dataLoaded) {
    console.error('No data has been loaded to graph');
    return false;
  }

  let currentDataSetsLength;

  if (!dataIndices) {
    dataIndices = [];
    currentDataSetsLength = dataSetsLength;

    for (let i = 0; i < dataSetsLength; i++) {
      dataIndices.push(i + 1);
    }
  } else {
    currentDataSetsLength = dataIndices.length;
  }

  let container = $('#graph-container-inner-box')[0];

  container.style.setProperty('top', `0`);
  container.style.setProperty('height', `${currentDataSetsLength}00%`);

  container.innerHTML = '';

  for (let i = 0; i < currentDataSetsLength; i++) {
    let newCanvas = document.createElement('canvas');
    newCanvas.id = `graphCanvas-${i + 1}`;
    newCanvas.classList.add('graphCanvas');
    newCanvas.classList.add(i + 1);

    container.appendChild(newCanvas);
    canvasDimConfigure(newCanvas.id);

    graphSingleSet(newCanvas.id, dataIndices[i]);
  }
}

// order a graph of a single set of data chosen by the user
const graphSingleSet = (canvasID='graphCanvas-1', dataIndex=currentDataIndex) => {
  if (!dataLoaded) {
    console.error('No data has been loaded to graph');
    return false;
  }

  let
    dataset,
    x = dataIndex - 1,
    keys = currentLoadedData.info.keys,
    setLimits = currentLoadedData.info.setLimits,
    currentLimits,
    dataLength = 0;

  if (sortbydata === 'sets') {
    dataset = currentLoadedData[x];
    dataLength = currentLoadedData.info.totalDatatypes;
    currentLimits = setLimits[x];
  } else {
    dataset = [];

    let min = NaN, max = NaN;

    for (let i = 0; i < currentLoadedData.info.totalDatasets; i++) {
      currentValue = currentLoadedData[i][keys[x]];
      dataset.push(currentValue);

      if (typeof currentValue === 'number') {
        if (isNaN(min)) {
          min = currentValue;
          max = currentValue;
        } else {
          if (currentValue > max) {
            max = currentValue;
          } else if (currentValue < min) {
            min = currentValue;
          }
        }
      }
    }

    currentLimits = {'min': min, 'max': max};
    dataLength = currentLoadedData.info.totalDatasets;
  }

  graph(canvasID, dataset, {'min': 0, 'max': dataLength}, currentLimits, XMultiplier, YMultiplier);
}

// load a dataset saved in the indexedDB by a given index
const loadPreviousData = (index) => {
  getObject(DBName, 'user', ver, index, (result) => {
    setupDatasets({ 'name' : `previousDataNo: ${index}` }, result.data, raw=false, fromSaved=true);
  });
}

// save the currently loaded data into the IndexedDB
const saveCurrentData = () => {
  if (!dataLoaded) {
    console.error('No data has been loaded to save');
    return false;
  }

  if (loadedFromSaves) {
    console.error('Currently loaded data is already from saves');
    return false;
  }

  getObject(DBName, 'user', ver, 'info', (userObject) => {
    userObject.totalDataSaves += 1;
    let totalSaves = userObject.totalDataSaves;
    putObject(DBName, 'user', ver, userObject);

    $('#previousData-container')[0].appendChild(newSlot(totalSaves));

    putObject(DBName, 'user', ver, { 'id' : totalSaves, 'previousDataID' : totalSaves, 'data' :  currentLoadedData });
  });
}

// delete data from indexedDB of given index
const deletePreviousData = (index) => {
  getObject(DBName, 'user', ver, 'info', (userObject) => {
    // $('#previousData-container')[0].removeChild($(`#previousData-slot-${index}`)[0]);

    userObject.totalDataSaves -= 1;

    let totalSaves = userObject.totalDataSaves;

    putObject(DBName, 'user', ver, userObject);
    deleteObject(DBName, 'user', ver, index);

    for (let i = index + 1; i <= totalSaves + 1; i++) {
      getObject(DBName, 'user', ver, i, (dataObject) => {
        putObject(DBName, 'user', ver, { 'id' : i - 1, 'previousDataID' : i - 1, 'data' :  dataObject.data });
      });
    }

    deleteObject(DBName, 'user', ver, totalSaves + 1, reLoadAllSlots);
  });
}

// download a given object as a json file
const downloadJsonData = (jsonData, indent=0) => {
  if (typeof jsonData !== 'object') {
    console.error('Provided variable is not of type "object"');
    return false;
  }

  let blob = new Blob([JSON.stringify(jsonData, null, indent)], {type: 'application/json'});
  let link = document.createElement('a');

  link.download = 'data.json';
  link.href = window.URL.createObjectURL(blob);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//confirm if the user really wants to logout
const confirmLogout = () => {
  customAlert.alert('confirmLogout');
}

// delete the indexedDB and logout the user
const logout = (result) => {
  if (result !== 'yes') return false;
  deleteDatabase(DBName);
  window.setTimeout(() => {window.location.reload()}, 500);
}

// set the backgroundColor style property of a given element
const setTheme = (target, value) => {
  console.log(target, value);
}

const getTextColorFromClassState = (state) => {
  if (state === 'W') return '#eee';
  else if (state === 'B') return '#111';
}

const getClassStateFromTextColor = (color) => {
  if (color === '#eee') return 'W';
  else if (color === '#111') return 'B';
}

const saveTheme = () => {
  console.log('New Theme');
  let newTheme = {
    'headerColor' : $('#themeInput-header')[0].value,
    'controlPanelColor' : $('#themeInput-controlPanel')[0].value,
    'controlContainersColor' : $('#themeInput-controlContainers')[0].value,
    'profileConfigColor' : $('#themeInput-profileConfig')[0].value,
    'graphContainerColor' : $('#themeInput-graphContainer')[0].value,
    'buttonsColor' : $('#themeInput-Buttons')[0].value,
    'headerColor_text' : getTextColorFromClassState($('#TextColorToggle-button-header')[0].classList[3]),
    'controlPanelColor_text' : getTextColorFromClassState($('#TextColorToggle-button-controlPanel')[0].classList[3]),
    'controlContainersColor_text' : getTextColorFromClassState($('#TextColorToggle-button-controlContainers')[0].classList[3]),
    'profileConfigColor_text' : getTextColorFromClassState($('#TextColorToggle-button-profileConfig')[0].classList[3]),
    'buttonsColor_text' : getTextColorFromClassState($('#TextColorToggle-button-Buttons')[0].classList[3])
  };

  putObject(DBName, 'user', ver, {'id' : 'theme', 'preferencesID' : 'theme', 'default' : false, 'theme' : newTheme}, loadTheme);
}

const resetTheme = () => {
  putObject(DBName, 'user', ver, {'id' : 'theme', 'preferencesID' : 'theme', 'default' : true, 'theme' : null}, loadTheme);
}
