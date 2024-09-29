document.addEventListener('click', (event) => {
  // console.log(event.target);

  switch (event.target.id) {
    case 'main-profile' : profileConfigLoadUnload();
      break;
    case 'profile-image' : profileConfigLoadUnload();
      break;
    default : console.log('unlisted click event');
  }
});

const profileConfigLoadUnload = () => {
  let
    profileConfigClassList = $('#profile-config')[0].classList,
    profileClassList = $('#main-profile')[0].classList;

  if (includes('active', profileConfigClassList)) {
    profileConfigClassList.remove('active');
    profileClassList.remove('active');
  } else {
    profileConfigClassList.add('active');
    profileClassList.add('active');
  }
}
