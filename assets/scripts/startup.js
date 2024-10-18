$(document).ready(() => {
  reLoadAllSlots();

  window.setTimeout(() => {window.scrollTo(0, 0)}, 100);
});

const getDataFromInput = (callback, callbackParams=undefined) => {
  let file = $('#fileUpload-input')[0].files[0];

  let reader = new FileReader();

  reader.readAsText(file, 'UTF-8');

  reader.onload = (event) => {
    if (callback) {
      if (callbackParams) {
        callback(file, event.target.result, callbackParams);
      } else {
        callback(file, event.target.result);
      }
    }
  }

  reader.onerror = () => {
    return false;
  }
}

const getTransposeState = () => {
  if (includes('on', $('#transpose-indicator')[0].classList)) {
    return true;
  }
  return false;
}

const checkData = (file, data) => {
  if (file.type !== 'text/csv') {
    customAlert.alert('invalidFileType');
    return false;
  }

  let JSONData = csvToJson(data, getTransposeState());

  if (JSONData instanceof Error) {
    customAlert.alert('unknownError');
    return false;
  }

  if (JSONData.info.totalDatasets === 0) {
    customAlert.alert('noDataFound');
    return false;
  }

  if (JSONData.info.includesInconsistentData) {
    customAlert.alert('inconsistentData');
    return false;
  }

  setupDatasets(file, JSONData, false);
}

const setupDatasets = (file, datasets, raw=true, fromSaves=false) => {
  if (raw) datasets = csvToJson(datasets, getTransposeState());

  let datasetInput = $('#dataIndexSelector-input')[0];
  
  dataSetsLength = datasets.info.totalDatasets;

  if (sortbydata === 'types') {
    dataSetsLength = datasets.info.totalDatatypes;
  }

  $('#dataSetDisplay-noDisplay')[0].innerHTML = dataSetsLength;
  $('.fileUpload.label')[0].innerHTML = file.name;
  datasetInput.max = dataSetsLength;
  datasetInput.value = 1;

  dataLoaded = true;
  currentLoadedData = datasets;
  loadedFromSaves = fromSaves;
}

const unloadDatasets = () => {
  currentLoadedData = undefined;
}

const setupDatasetsAlertBuffer = (result) => {
  if (result === 'yes') getDataFromInput(setupDatasets);
  else return false;
}

// create and return a new saved data slot by the given index
const newSlot = (index) => {
  let slot = document.createElement('span');
  let loader = document.createElement('span');
  let deleteBTN = document.createElement('span');

  slot.id = `previousData-slot-${index}`;
  slot.classList.add('previousData');
  slot.classList.add('slot');
  slot.classList.add(index);

  loader.id = `previousData-loader-${index}`;
  loader.classList.add('previousData');
  loader.classList.add('loader');
  loader.classList.add(index);
  loader.classList.add('btntyp1');
  loader.innerHTML = `Saved Data no ${index}`

  deleteBTN.id = `previousData-deleteBTN-${index}`;
  deleteBTN.classList.add('previousData');
  deleteBTN.classList.add('deleteBTN');
  deleteBTN.classList.add(index);
  deleteBTN.classList.add('btntyp1');

  slot.appendChild(loader);
  slot.appendChild(deleteBTN);

  return slot;
}

const reLoadAllSlots = () => {
  let container = $('#previousData-container')[0];
  container.innerHTML = '';

  getObject(DBName, 'user', ver, 'info', (userObject) => {
    for (let i = 0; i < userObject.totalDataSaves; i++) {
      container.appendChild(newSlot(i + 1));
    }
  });
}

// setup all the custom alerts
// errors
{
  customAlert.new([25, 20], [37.5, 25], "#d35252", "111", ['ok'], true, 'invalidFileType', '%', 'Pleas upload a .csv file', '3.5vh');
  customAlert.new([25, 20], [37.5, 25], "#d35252", "111", ['ok'], true, 'unknownError', '%', 'Something unexpected happened (Please check console for additional info)', '2.5vh');
  customAlert.new([25, 20], [37.5, 25], "#d35252", "111", ['ok'], true, 'noDataFound', '%', 'The file doesn\'t contain any data', '3.5vh');
}
//warnings
{
  customAlert.new([25, 20], [37.5, 25], "#d8c34e", "111", ['yes', 'no'], true, 'inconsistentData', '%', 'Some datapoints in the datasets are not numbers.\nWould you still like to continue?', '2.5vh', setupDatasetsAlertBuffer);
  customAlert.new([28, 25], [37.5, 25], "#d8c34e", "111", ['yes', 'no'], true, 'confirmLogout', '%', 'Performing this action will erase all your data from the database.\nAre you sure you want to Log Out?', '2.5vh', logout);
}

// customAlert.alert('invalidFileType');
// customAlert.alert('inconsistentData');
