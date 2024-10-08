let
  profileConfig = $('#profile-config')[0],
  profile = $('#main-profile')[0],
  footerScrollSpeed = 200, // in ms
  footerScrollBlocked = false,
  workplaceScrolling = false,
  workplaceScrollerFPS = 60, // intervals per second
  workplaceScrollerSpeed = 4; // pxixels per interval
  sortbydata = 'sets',
  dataLoaded = false;

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
    datasetInput = $('#dataIndexSelector-input')[0],
    totalData = 0;

  if (sortbydata === 'sets') {
    if (dataLoaded) {
      totalData = currentLoadedData.info.totalDatatypes;
    }

    indicator.innerHTML = 'Sort By Types';
    sortbydata = 'types';
  } else {
    if (dataLoaded) {
      totalData = currentLoadedData.info.totalDatasets;
    }
    
    indicator.innerHTML = 'Sort By Sets';
    sortbydata = 'sets';
  }

  if (dataLoaded) {
    datasetNoDisplay.innerHTML = totalData;
    datasetInput.max = totalData;
    datasetInput.value = 1;
    currentDataIndex = 1;
  }
}

// order a graph of a single set of data chosen by the user
const graphSingleSet = (canvasID = 'graphCanvas-1', dataIndex = currentDataIndex) => {
  if (dataLoaded) {
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

    graph(canvasID, dataset, {'min': 0, 'max': dataLength}, currentLimits);
  } else {
    console.error("No data has been loaded to graph");
    return false;
  }
}
