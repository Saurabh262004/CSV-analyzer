const setUsername = (userObject) => {
  if (userObject) {
    $('#profile-name')[0].innerHTML = userObject.userName;
  } else {
    console.log(userObject);
    return userObject;
  }
}

getObject(DBName, 'user', ver, 'userName', setUsername);
