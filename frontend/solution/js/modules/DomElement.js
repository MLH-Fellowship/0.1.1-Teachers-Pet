// Document element selector modal with basic functionalities

class DomElement {
  constructor(id) {
    this.element = document.getElementById(id);
  }

  addClass(className) {
    this.element.classList.add(className);
  }

  removeClass(className) {
    this.element.classList.remove(className);
  }

  show() {
    this.removeClass('hidden');
  }

  hide() {
    this.addClass('hidden');
  }

  setText(text) {
    this.element.innerHTML = text;
  }

  addEvent(event, callback) {
    if (typeof (callback) === 'function') {
      this.element.addEventListener(event, callback);
    }
  }

  onClick(callback) {
    this.addEvent('click', callback);
  }

  addChild(ch) {
    this.element.appendChild(ch);
  }

  removeContent() {
    this.element.innerHTML = '';
  }

  setAttribute(attributes, element) {
    const ele = element || this.element;
    if (attributes) {
      const attributeKeys = Object.keys(attributes);
      for (let i = 0; i < attributeKeys.length; i += 1) {
        ele.setAttribute(attributeKeys[i], attributes[attributeKeys[i]]);
      }
    }
  }

  setStyle(style) {
    if (style) {
      const styleKeys = Object.keys(style);
      for (let i = 0; i < styleKeys.length; i += 1) {
        this.element.style[styleKeys[i]] = style[styleKeys[i]];
      }
    }
  }
}

export default DomElement;
