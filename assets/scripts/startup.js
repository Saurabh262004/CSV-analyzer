$(document).ready(() => {
  setOverflowHiderHeight();

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

const checkData = (file, data) => {
  if (file.type !== 'text/csv') {
    customAlert.alert('invalidFileType');
    console.error("Please upload a .csv file");
    return false;
  }

  let dataJsonArr = csvToJson(data);

  for (let i = 0; i < dataJsonArr.length-1; i++) {
    if (!dataJsonArr[dataJsonArr.length-1].datasetTotalNums[i]) {
      customAlert.alert('inconsistentData');
      return false;
    }
  }
  setupDatasets(file, dataJsonArr, false);
}

const setupDatasets = (file, datasets, raw=true) => {
  if (raw) datasets = csvToJson(datasets);

  $('#dataSetDisplay-noDisplay')[0].innerHTML = datasets.length-1;
  $('.fileUpload.label')[0].innerHTML = file.name;
}

const setupDatasetsAlertBuffer = (result) => {
  if (result === 'yes') getDataFromInput(setupDatasets);
  else return false;
}

// setup all the custom alerts
customAlert.new([25, 20], [37.5, 25], "#d35252", "111", ['ok'], true, 'invalidFileType', '%', 'Pleas upload a .csv file', '3.5vh', test);
customAlert.new([25, 20], [37.5, 25], "#d8c34e", "111", ['yes', 'no'], true, 'inconsistentData', '%', 'Some datapoints in the datasets are not numbers.\nWould you still like to continue?', '2.5vh', setupDatasetsAlertBuffer);

// customAlert.alert('invalidFileType');
// customAlert.alert('inconsistentData');
