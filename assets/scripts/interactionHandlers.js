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
        workplace.style.setProperty('top', `${(workplaceTop - headerHeight) + (workplaceScrollerSpeed * speedMultiplier)}px`);
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
      scroller.innerHTML = 'Up';
    } else {
      footerScrollBlocked = true;
      scrollAnim(0, 0, footerScrollSpeed, () => {footerScrollBlocked = false});
      scrollerClassList.add('down');
      scrollerClassList.remove('up');
      scroller.innerHTML = 'Down';
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

    let newSlot = document.createElement('span');

    newSlot.id = `previousData-slot-${totalSaves}`;
    newSlot.classList.add('previousData');
    newSlot.classList.add('slot');
    newSlot.classList.add(totalSaves);
    newSlot.classList.add('btntyp1');
    newSlot.innerHTML = `Dataset No : ${totalSaves}`;

    $('#previousData-container')[0].appendChild(newSlot);

    putObject(DBName, 'user', ver, { 'id' : totalSaves, 'previousDataID' : totalSaves, 'data' :  currentLoadedData });
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
