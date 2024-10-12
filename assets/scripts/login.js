let
  usernameInput = $('#login-input-username'),
  pfpInput = $('#login-input-pfp'),
  imageData = false,
  userNameGlobal = false;

customAlert.new([25, 20], [37.5, 30], "#d35252", "111", ['ok'], true, 'noUsername', '%', 'Please enter a username.', '2.5vh');
customAlert.new([25, 20], [37.5, 30], "#d35252", "111", ['ok'], true, 'invalidUsernameLength', '%', 'The username must be 4-16 characters long.', '2.5vh');
customAlert.new([25, 20], [37.5, 30], "#d35252", "111", ['ok'], true, 'invalidUsernameCharacters', '%', 'The username must only contain characters from A-B (upper and lower case) and 0-9.', '2.5vh');
customAlert.new([25, 20], [37.5, 30], "#d35252", "111", ['ok'], true, 'noUserPFP', '%', 'Please upload a profile image.', '2.5vh');
customAlert.new([25, 20], [37.5, 30], "#d35252", "111", ['ok'], true, 'invalidPFP', '%', 'Please upload a png or jpeg image.', '2.5vh');

const isValidUsername = (str) => {
  return /^[A-Za-z0-9]+$/.test(str);
}

const checkUserInputs = () => {
  const userName = usernameInput[0].value;

  console.log(userName);

  if (!userName) {
    customAlert.alert('noUsername');
    return false;
  }

  if (userName.length > 16 || userName.length < 4) {
    customAlert.alert('invalidUsernameLength');
    return false;
  }

  if (!isValidUsername(userName)) {
    customAlert.alert('invalidUsernameCharacters');
    return false;
  }

  if (!imageData) {
    customAlert.alert('noUserPFP');
    return false;
  }

  userNameGlobal = userName;

  return true;
}

pfpInput.change(() => {
  const imageFile = pfpInput[0].files[0];

  if (imageFile.type !== 'image/png' && imageFile.type !== 'image/jpeg') {
    customAlert.alert('invalidPFP');
    return false;
  }

  if (!imageFile) {
    return false;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = document.createElement('img');
    const imgContainer = $('#pfpPreview-container')[0];

    img.src = event.target.result;
    img.classList.add('pfpImage');

    imgContainer.innerHTML = '';
    imgContainer.appendChild(img);
    imageData = event.target.result;
    imageLoading = false;
  }

  reader.readAsDataURL(imageFile);
});

const saveUserProfile = () => {
  if (!checkUserInputs()) return false;

  const newObject = {
    'id' : 'info',
    'infoID' : 'userData',
    'firstTimeUser' : false,
    'userName' : userNameGlobal,
    'pfp' : imageData
  };

  putObject(DBName, 'user', ver, newObject, () => {goToURL('index.html')});
}

usernameInput[0].focus();
