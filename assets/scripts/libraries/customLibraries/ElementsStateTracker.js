/*
 * Documentation:
 *
 * Dependency : jQuery
 *
 * > `focusWithin` stores the focus-within css info (boolean)
 *
 * > `mouseHover` stores the hover css info (boolean)
 *
 * > `q` versions store the state change info (boolean)
 *   [
 *     - if an event changes the elements state, this value will be true
 *     - in the next event if the element doesn't change the state, this value will turn false
 *   ]
 *
 * > `logByClass()` returns an object containing above information and position of that object in the elements array using shorter naming conventions.
 *   This function only has one argument, the class name of an element.
 *   If the class name is invalid, false (boolean) will be returned.
 * 
 * > The library is only made to utilize the `logByClass()` function but the other functions can be called without causing any bugs.
*/

let Elements = {
  elements_count : 0,
  elements : [],
  focusWithin : [],
  mouseHover : [],
  focusWithin_q : [],
  mouseHover_q : [],

  update : () => {
    let E = Elements,
    h = E.mouseHover,
    f = E.focusWithin,
    hq = E.mouseHover_q,
    fq = E.focusWithin_q,
    e = E.elements;

    for (let i = 0; i < e.length; i++) {
      if ($(e[i]).is(':hover')) {
        hq[i] = h[i] ? false : true;
        h[i] = true;
      } else {
        hq[i] = h[i];
        h[i] = false;
      }

      if ($(e[i]).is(':focus-within')) {
        fq[i] = f[i] ? false : true;
        f[i] = true;
      } else {
        fq[i] = f[i];
        f[i] = false;
      }
    }
  },

  addElement : (element) => {
    let E = Elements,
    elem_check = isDOMElement(element);

    if (elem_check[0]) {
      E.elements.push(elem_check[1]);
      E.focusWithin.push(false);
      E.focusWithin_q.push(false);
      E.mouseHover.push(false);
      E.mouseHover_q.push(false);
      E.elements_count++;
      return true;
    }

    return false;
  },

  check : (element) => {
    let E = Elements;
    if ($.inArray(element, E.elements) === -1) {
      E.addElement(element);
    }
    E.update();
  },

  positionByClass : (className) => {
    let spaceLessClass = replaceSpace(className, '.'); // replace_space if available

    return $.inArray($(spaceLessClass)[0], Elements.elements);
  },

  positionByID : (id) => {
    return $.inArray($('#'+id)[0], Elements.elements);
  },

  logByClass : (className) => {
    let
    E = Elements,
    pos = E.positionByClass(className);

    if (pos === -1) return false;

    let log = {
      f : E.focusWithin[pos],
      fq : E.focusWithin_q[pos],
      h : E.mouseHover[pos],
      hq : E.mouseHover_q[pos],
      pos : pos,
    };

    return log;
  }
}

document.addEventListener('click', (event) => {Elements.check(event.target)});
document.addEventListener('mouseover', (event) => {Elements.check(event.target)});
document.addEventListener('mouseleave', (event) => {Elements.check(event.target)});
