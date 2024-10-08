let currentLoadedData, currentDataIndex = 1;

$(document).ready(() => {
  setOverflowHiderHeight();
  canvasDimConfigure('graphCanvas-1');

  window.setTimeout(() => {window.scrollTo(0, 0)}, 100);
});

const test = (a) => {
  console.log(a);
}

const getDataFromInput = (callback, callbackParams=false) => {
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

const setupDatasets = (file, datasets, raw=true) => {
  if (raw) datasets = csvToJson(datasets, getTransposeState());

  let
    totalData = datasets.info.totalDatasets,
    datasetInput = $('#dataIndexSelector-input')[0];

  if (sortbydata === 'types') {
    totalData = datasets.info.totalDatatypes;
  }

  $('#dataSetDisplay-noDisplay')[0].innerHTML = totalData;
  $('.fileUpload.label')[0].innerHTML = file.name;
  datasetInput.max = totalData;
  datasetInput.value = 1;

  dataLoaded = true;
  currentLoadedData = datasets;
}

const unloadDatasets = () => {
  currentLoadedData = undefined;
}

const setupDatasetsAlertBuffer = (result) => {
  if (result === 'yes') getDataFromInput(setupDatasets);
  else return false;
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
}

// customAlert.alert('invalidFileType');
// customAlert.alert('inconsistentData');
