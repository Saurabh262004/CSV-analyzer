keyLog = {};

// keyboard shortcut controls
document.addEventListener('keydown', (event) => {
  key = event.key;
  keyLog[key] = true;

  if (keyLog['Control']) {
    let
      scroller = $('#main-scroller')[0],
      profile = $('#main-profile')[0];

    if ((key == 'ArrowDown' && includes('down', scroller.classList)) || (key == 'ArrowUp' && includes('up', scroller.classList))) {
      footerScroll();
    } else if ((key == 'ArrowRight' && !includes('active', profile.classList)) || (key == 'ArrowLeft' && includes('active', profile.classList))) {
      profileConfigLoadUnload();
    }
  }
});

document.addEventListener('keyup', (event) => {
  key = event.key;

  keyLog[key] = false;
});

// click event controls
document.addEventListener('click', (event) => {
  switch (event.target.id) {
    case 'main-profile' : profileConfigLoadUnload();
      break;
    case 'profile-image' : profileConfigLoadUnload();
      break;
    case 'main-scroller' : footerScroll();
  }
});

// file upload change event
$('#file-upload-input').change(() => {
  $('.option.lable._1')[0].innerHTML = $('#file-upload-input')[0].files[0].name;
});
