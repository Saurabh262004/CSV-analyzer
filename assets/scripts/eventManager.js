document.addEventListener('click', (event) => {
  console.log(event.target);
  switch (event.target.id) {
    case 'main-profile' : {
      let profileConfigClassList = $('#profile-config')[0].classList;

      if (includes('active', profileConfigClassList)) {
        profileConfigClassList.remove('active');
      } else {
        profileConfigClassList.add('active');
      }
    } break;
    default : console.log('unlisted click event');
  }
});
