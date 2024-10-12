// all the global variables:
let

profileConfig = $('#profile-config')[0],
profile = $('#main-profile')[0],
footerScrollSpeed = 200, // in ms
footerScrollBlocked = false,
workplaceScrolling = false,
workplaceScrollerFPS = 60, // intervals per second
workplaceScrollerSpeed = 4, // pxixels per interval
sortbydata = 'sets',
dataLoaded = false,
dataSetsLength = 0,
XMultiplier = 1,
YMultiplier = 1,
keyLog = {}, // to track every key if it's presed or not
mousedown = false,
currentDataIndex = 1,
currentLoadedData,
loadedFromSaves = false;
