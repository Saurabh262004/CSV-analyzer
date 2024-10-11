// converts any csv data into json format
const csvToJson = (csv, transpose=false, downloadJSON=false, separator=',') => {
  if (!csv) {
    console.error('Please provide a csv string');
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

// interpolate cubic spline by given x, y co-ordinate list
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

// evaluate the spline at new points
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
const graph = (canvasID, data, XRange, YRange, XMulti, YMulti) => {
  let
    canvas = $(`#${canvasID}`)[0],
    ctx = canvas.getContext('2d'),
    dataArr = [],
    minX = XRange.min,
    maxX = XRange.max,
    minY = YRange.min,
    maxY = YRange.max,
    canvasW = canvas.width,
    canvasH = canvas.height,
    XPadding = canvasH/8.5,
    YPadding = canvasH/8.5;

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
    if (minY <= 0) {
      y[i] += Math.abs(minY) + 1;
    }
    x.push(i + 1);
  }

  let {a, b, c, d, x: XPoints} = cubicSpline(x, y);

  let
    XEval = [],
    numPoints = 1000;

  for (let i = 0; i < numPoints; i++) {
    XEval.push(minX + (i * (maxX - minX)) / numPoints);
  }

  let
    YEval = evaluateSpline(a, b, c, d, XPoints, XEval),
    XL = Math.min(...XEval),
    XH = Math.max(...XEval),
    YL = Math.min(...YEval),
    YH = Math.max(...YEval);

  for (let i = 0; i < YEval.length; i++) {
    XEval[i] = map(XEval[i], XL, XH, XPadding, (canvasW - XPadding) * XMulti);
    YEval[i] = map(YEval[i], YL, YH, canvasH - YPadding, YPadding - ((YMulti - 1) * 500));
  }

  // clear canvas
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // setup new path
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#000';
  ctx.beginPath();

  // draw axis
  ctx.moveTo(XPadding, 0);
  ctx.lineTo(XPadding, canvasH);
  ctx.moveTo(0, canvasH - YPadding);
  ctx.lineTo(canvasW, canvasH - YPadding);

  // draw Y axis text
  let
    totalAxisIntervals = 10,
    YAxisStep = (maxY - minY) / totalAxisIntervals,
    heightStep = Math.abs(Math.max(...YEval) - Math.min(...YEval)) / totalAxisIntervals,
    fontSize = 20;

  if (YMulti < 1) {
    fontSize = 20 * YMulti;
  }

  ctx.font = `${fontSize}px courier`;

  for (let i = 0; i <= totalAxisIntervals; i++) {
    let currentText = (minY + (YAxisStep * i)).toFixed(1);

    if (maxY - minY >= 10) {
      currentText = parseInt(currentText);
    }

    ctx.fillText(currentText, XPadding - (currentText.toString().length * ((fontSize / 4) * 3)), ((canvasH - YPadding) - (heightStep * i)) + fontSize);
  }

  // draw data
  ctx.moveTo(XEval[0], YEval[0]);
  ctx.fillStyle = '#a15b5b';
  for (let i = 1; i < YEval.length; i++) {
    ctx.lineTo(XEval[i], YEval[i]);
    ctx.fillRect(XEval[i-1], YEval[i-1], XEval[i] - XEval[i-1], (canvasH - YEval[i-1]) - YPadding);
  }

  ctx.stroke();
}
