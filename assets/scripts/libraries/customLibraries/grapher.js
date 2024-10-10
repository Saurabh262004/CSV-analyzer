// converts any csv data into json format
const csvToJson = (csv, transpose=false, downloadJSON=false, separator=',') => {
  if (!csv) {
    console.error("Please provide a csv string")
    return false;
  }

  csv = removeChar(removeChar(csv, ' '), '\r');
  if (csv[csv.length-1] !== '\n') csv += '\n';

  JSONData = {};

  // setting up variables to store the data temporarily before putting it all into `JSONData`
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

    if (csv[i] === '\n') {
      getDataTypeLline = false;
      dataSection = true;
    }
  }

  // separating all the datatypes into an array
  let dataType = '';
  for (let i = 0; i < rawDataTypes.length; i++) {
    if (rawDataTypes[i] === separator || rawDataTypes[i] === '\n') {
      if (dataType !== '') {
        dataTypesArr.push(dataType);
        dataType = '';
      }
    } else dataType += rawDataTypes[i];
  }

  // separating all the data into a 2d array
  let data = '';
  let dataArr = [];
  for (let i = 0; i < rawData.length; i++) {
    if (rawData[i] === separator || rawData[i] === '\n') {
      if (data !== '') {
        dataArr.push(data);
        data = '';

        if (rawData[i] === '\n') {
          dataArr2D.push(dataArr);
          dataArr = [];
        }
      }
    } else data += rawData[i];
  }

  // check if the file is corrupted
  let
    missingDataInstances = 0,
    nonCategorisedDataInstances = 0;
  for (let i = 0; i < dataArr2D.length; i++) {
    if (dataTypesArr.length > dataArr2D[i].length) {
      missingDataInstances += dataTypesArr.length - dataArr2D[i].length;
    } else if (dataTypesArr.length < dataArr2D[i].length) {
      nonCategorisedDataInstances += dataArr2D[i].length - dataTypesArr.length;
    }
  }

  if (missingDataInstances > 0 || nonCategorisedDataInstances > 0) {
    let corruptedFile = new Error(`The provided csv file might be corrupted.\nWe detected ${missingDataInstances} instance(s) of missing data and ${nonCategorisedDataInstances} instance(s) of non categorized data.`);
    console.error(corruptedFile);
    return corruptedFile;
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

  // finally putting all the data into the `JSONData`
  let includesInconsistentData = false, setLimits = [];
  for (let i = 0; i < dataArr2D.length; i++) {
    JSONData[i] = {};
    let currentMin = NaN, currentMax = NaN;

    for (let j = 0; j < dataArr2D[i].length; j++) {
      currentData = dataArr2D[i][j];

      if (isNumber(currentData) || isStrictFloat(currentData)) {
        currentData = parseFloat(currentData);

        if (isNaN(currentMin)) {
          currentMin = currentData;
          currentMax = currentData;
          // console.log(currentMin+'\n'+currentMax);
        } else {
          if (currentData < currentMin) {
            currentMin = currentData;
          } else if (currentData > currentMax) {
            currentMax = currentData;
          }
        }
      } else {
        includesInconsistentData = true;
      }

      JSONData[i][dataTypesArr[j]] = currentData;
    }

    setLimits.push({'min': currentMin, 'max': currentMax});
  }

  // console.log(dataArr2D);

  JSONData.info = {
    'keys': dataTypesArr,
    'totalDatasets': dataArr2D.length,
    'totalDatatypes': dataTypesArr.length,
    'includesInconsistentData': includesInconsistentData,
    'setLimits' : setLimits
  };

  if (downloadJSON) {
    console.log("Sorry but I don't have time to implement this right now.");
  }

  console.log(JSONData);

  return JSONData;
}

// Cubic spline interpolation function
const cubicSpline = (x, y) => {
  let
    n = x.length - 1,
    h = new Array(n),
    alpha = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) {
    h[i] = x[i+1] - x[i];
  }

  for (let i = 1; i < n; i++) {
    alpha[i] = (3 / h[i] * (y[i+1] - y[i])) - (3 / h[i - 1] * (y[i] - y[i-1]));
  }

  let
    l = new Array(n + 1).fill(0),
    mu = new Array(n + 1).fill(0),
    z = new Array(n + 1).fill(0);

  l[0] = 1;
  mu[0] = 0;
  z[0] = 0;

  for (let i = 1; i < n; i++) {
    l[i] = 2 * (x[i+1] - x[i-1]) - h[i-1] * mu[i-1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i-1] * z[i-1]) / l[i];
  }

  l[n] = 1;
  z[n] = 0;

  let
    a = y.slice(0, n),
    b = new Array(n).fill(0),
    c = new Array(n + 1).fill(0),
    d = new Array(n).fill(0);

  for (let j = n - 1; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j+1];
    b[j] = (y[j+1] - y[j]) / h[j] - h[j] * (c[j+1] + 2 * c[j]) / 3;
    d[j] = (c[j+1] - c[j]) / (3 * h[j]);
  }

  return {a, b, c, d, x};
}

// Evaluate the spline at new points
const evaluateSpline = (a, b, c, d, x, XEval) => {
  let YEval = [];

  for (let X of XEval) {
    for (let i = 0; i < x.length - 1; i++) {
      if (x[i] <= X && X <= x[i+1]) {
        let dx = X - x[i];
        let Y = a[i] + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx;
        YEval.push(Y);
        break;
      }
    }
  }

  return YEval;
}

// graph a given set of data onto an html canvas
const graph = (canvasID, data, XRange, YRange) => {
  let
    canvas = $(`#${canvasID}`)[0],
    ctx = canvas.getContext('2d'),
    dataArr = [],
    canvasW = canvas.width,
    canvasH = canvas.height,
    XPadding = canvasH/10,
    YPadding = canvasH/10;

  // store given data in array
  if (data instanceof Array) {
    dataArr = data;
  } else {
    keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
      dataArr.push(data[keys[i]]);
    }
  }

  // setup x, y co-ordinates and calculate a spline
  let x = [], y = dataArr;

  for (let i = 0; i < dataArr.length; i++) {
    if (YRange.min <= 0) {
      y[i] += Math.abs(YRange.min) + 1;
    }
    x.push(i + 1);
  }

  let {a, b, c, d, x: XPoints} = cubicSpline(x, y);

  let
    XEval = [],
    minX = XRange.min,
    maxX = XRange.max,
    numPoints = 1000;

  for (let i = 0; i < numPoints; i++) {
    XEval.push(minX + (i * (maxX - minX)) / numPoints);
  }

  let
    YEval = evaluateSpline(a, b, c, d, XPoints, XEval),
    YL = Math.min(...YEval),
    YH = Math.max(...YEval),
    XL = Math.min(...XEval),
    XH = Math.max(...XEval);

  for (let i = 0; i < YEval.length; i++) {
    YEval[i] = map(YEval[i], YL, YH, canvasH - YPadding, YPadding);
    XEval[i] = map(XEval[i], XL, XH, XPadding, canvasW - XPadding);
  }

  // clear canvas
  ctx.fillStyle = '#eeeeee';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // setup new path
  ctx.fillStyle = '#a15b5b';
  ctx.strokeStyle = '#000000';
  ctx.beginPath();

  // draw axis
  ctx.moveTo(XPadding, 0);
  ctx.lineTo(XPadding, canvasH);
  ctx.moveTo(0, canvasH - YPadding);
  ctx.lineTo(canvasW, canvasH - YPadding);

  // draw data
  ctx.moveTo(XEval[0], YEval[0]);
  for (let i = 1; i < YEval.length; i++) {
    ctx.lineTo(XEval[i], YEval[i]);
    ctx.fillRect(XEval[i-1], YEval[i-1], XEval[i] - XEval[i-1], (canvasH - YEval[i-1]) - YPadding);
  }

  ctx.stroke();
}
