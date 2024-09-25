// converts any csv data into json format
const csvToJson = (csv, transpose=false, DownloadJSON=false, separator=',') => {
  if (!csv) {
    console.error("Please provide a csv string")
    return false;
  }

  csv = removeChar(csv);
  dataJsonArr = [];

  // setting up variables to store the data temporarily before putting it all into `dataJsonArr`
  let
    rawDataTypes = '',
    rawData = '',
    dataTypesArr = [],
    dataArr2D = [],
    getDataTypeLline = true,
    dataSection = false;

  // separate the datatypes from the actual data
  for (let i = 0; i < csv.length; i++) {
    if (getDataTypeLline) rawDataTypes += csv[i];

    if (dataSection) rawData += csv[i];

    if (csv[i] == '\n') {
      getDataTypeLline = false;
      dataSection = true;
    }
  }

  // separating all the datatypes into an array
  let dataType = '';
  for (let i = 0; i < rawDataTypes.length; i++) {
    if (rawDataTypes[i] == separator || rawDataTypes[i] == '\n') {
      dataTypesArr.push(dataType);
      dataType = '';
    } else dataType += rawDataTypes[i];
  }

  // separating all the data into a 2d array
  let data = '';
  let dataArr = [];
  for (let i = 0; i < rawData.length; i++) {
    if (rawData[i] == separator || rawData[i] == '\n') {
      dataArr.push(data);
      data = '';

      if (rawData[i] == '\n') {
        dataArr2D.push(dataArr);
        dataArr = [];
      }
    } else data+= rawData[i];
  }

  // transpose all the data if the transpose option is selected
  if (transpose) {
    let tDataTypesArr = [];
    let tDataArr2d = [];
    
    tDataTypesArr.push(dataTypesArr[0]);
    for (let i = 0; i < dataArr2D.length; i++) {
      tDataTypesArr.push(dataArr2D[i][0]);
    }

    for (let i = 1; i < dataTypesArr.length; i++) {
      tDataArr2d.push([]);
      tDataArr2d[i-1].push(dataTypesArr[i]);
    }

    for (let i = 1; i < dataArr2D[0].length; i++) {
      for (let j = 0; j < dataArr2D.length; j++) {
        tDataArr2d[i-1].push(dataArr2D[j][i]);
      }
    }

    dataTypesArr = tDataTypesArr;
    dataArr2D = tDataArr2d;
  }

  // finally putting all the data into the `dataJsonArr`
  for (let i = 0; i < dataArr2D.length; i++) {
    dataJsonArr.push({});

    for (let j = 0; j < dataArr2D[i].length; j++) {
      currentData = dataArr2D[i][j];

      if (isNumber(currentData)) {
        currentData = parseInt(currentData);
      } else if (isStrictFloat(currentData)) {
        currentData = parseFloat(currentData);
      }

      dataJsonArr[i][dataTypesArr[j]] = currentData;
    }
  }

  return dataJsonArr;
}

// graph a given set of data onto an html canvas
const graph = (canvasID, data, XType, YType, XRange, YRange, graphType) => {}
