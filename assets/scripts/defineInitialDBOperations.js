const redirectFirstTimeUser = () => {
  getObject(DBName, 'user', ver, 'info', (userObject) => {
    if (!userObject || userObject.firstTimeUser) {
      goToURL('login.html');
    }
  });
}

const setUsernameAndPFP = (userObject) => {
  if (userObject) {
    $('#profile-name')[0].innerHTML = userObject.userName;
    $('#profile-image')[0].src = userObject.pfp;
  } else {
    console.log(userObject);
    return userObject;
  }
}
