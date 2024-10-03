$(document).ready(() => {
  setOverflowHiderHeight();

  window.setTimeout(() => {window.scrollTo(0, 0)}, 100);
});

customAlert.new([25, 25], [37.5, 25], "#d35252", "111", ['ok'], true, 'invalidFileType', '%', 'Pleas upload a .csv file', '1em');

// customAlert.alert('InvalidFileType');
