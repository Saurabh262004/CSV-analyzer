document.addEventListener('click', (event) => {
  // console.log(event.target);

  switch (event.target.id) {
    case 'main-profile' : profileConfigLoadUnload();
      break;
    case 'profile-image' : profileConfigLoadUnload();
      break;
    case 'main-scroller' : footerScroll();
    //   break;
    // default : console.log('unlisted click event');
  }
});

var
  profileConfigClassList = $('#profile-config')[0].classList,
  profileClassList = $('#main-profile')[0].classList;

// adds/removes class name 'active' to profile config window
const profileConfigLoadUnload = () => {
  if (includes('active', profileConfigClassList)) {
    profileConfigClassList.remove('active');
    profileClassList.remove('active');
  } else {
    profileConfigClassList.add('active');
    profileClassList.add('active');
  }
}
