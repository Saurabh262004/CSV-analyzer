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

// load the custom theme of the user from the database if not set load the default theme
const loadTheme = () => {
  getObject(DBName, 'user', ver, 'theme', (theme) => {
    if (!theme) {
      console.log('no theme object found');
      return false;
    }

    let currentTheme;

    if (theme.default) currentTheme = defaultTheme;
    else currentTheme = theme.theme;

    let root = document.querySelector(':root');
    root.style.setProperty('--headerColor', currentTheme.headerColor);
    root.style.setProperty('--controlPanelColor', currentTheme.controlPanelColor);
    root.style.setProperty('--controlContainersColor', currentTheme.controlContainersColor);
    root.style.setProperty('--profileConfigColor', currentTheme.profileConfigColor);
    root.style.setProperty('--graphContainerColor', currentTheme.graphContainerColor);
    root.style.setProperty('--buttonsColor', currentTheme.buttonsColor);
    root.style.setProperty('--headerColor_text', currentTheme.headerColor_text);
    root.style.setProperty('--controlPanelColor_text', currentTheme.controlPanelColor_text);
    root.style.setProperty('--controlContainersColor_text', currentTheme.controlContainersColor_text);
    root.style.setProperty('--profileConfigColor_text', currentTheme.profileConfigColor_text);
    root.style.setProperty('--buttonsColor_text', currentTheme.buttonsColor_text);

    $('#theme-header')[0].style.backgroundColor = currentTheme.headerColor;
    $('#theme-controlPanel')[0].style.backgroundColor = currentTheme.controlPanelColor;
    $('#theme-controlContainers')[0].style.backgroundColor = currentTheme.controlContainersColor;
    $('#theme-profileConfig')[0].style.backgroundColor = currentTheme.profileConfigColor;
    $('#theme-graphContainer')[0].style.backgroundColor = currentTheme.graphContainerColor;
    $('#theme-Buttons')[0].style.backgroundColor = currentTheme.buttonsColor;


    $('#TextColorToggle-button-header')[0].classList.remove($('#TextColorToggle-button-header')[0].classList[3]);
    $('#TextColorToggle-button-header')[0].classList.add(getClassStateFromTextColor(currentTheme.headerColor_text));

    $('#TextColorToggle-button-controlPanel')[0].classList.remove($('#TextColorToggle-button-controlPanel')[0].classList[3]);
    $('#TextColorToggle-button-controlPanel')[0].classList.add(getClassStateFromTextColor(currentTheme.controlPanelColor_text));

    $('#TextColorToggle-button-controlContainers')[0].classList.remove($('#TextColorToggle-button-controlContainers')[0].classList[3]);
    $('#TextColorToggle-button-controlContainers')[0].classList.add(getClassStateFromTextColor(currentTheme.controlContainersColor_text));

    $('#TextColorToggle-button-profileConfig')[0].classList.remove($('#TextColorToggle-button-profileConfig')[0].classList[3]);
    $('#TextColorToggle-button-profileConfig')[0].classList.add(getClassStateFromTextColor(currentTheme.profileConfigColor_text));

    $('#TextColorToggle-button-Buttons')[0].classList.remove($('#TextColorToggle-button-Buttons')[0].classList[3]);
    $('#TextColorToggle-button-Buttons')[0].classList.add(getClassStateFromTextColor(currentTheme.buttonsColor_text));
  });
}
