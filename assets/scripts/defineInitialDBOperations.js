// if the user is set as a first time user in the databse redirect the user to the login page
const redirectFirstTimeUser = () => {
  getObject(DBName, 'user', ver, 'info', (userObject) => {
    if (!userObject || userObject.firstTimeUser) {
      goToURL('login.html');
    }
  });
}

// load the username of the user stored from the database
const setUsernameAndPFP = (userObject) => {
  if (!userObject) {
    return false;
  }

  $('#profile-name')[0].innerHTML = userObject.userName;
  $('#profile-image')[0].src = userObject.pfp;
}

// load the custom theme of the user from the database
const loadTheme = () => {}
