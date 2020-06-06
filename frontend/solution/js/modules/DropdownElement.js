import DomElement from './DomElement';

/*
* Note: native dropdown is used due to time constraint
*/


// dropdown element selector modal with dropdown specific functionalities
class DropdownElement extends DomElement {
  constructor(id) {
    super(id);
    this.name = id.charAt(0).toUpperCase() + id.slice(1);
    this.addPlaceHolder(this.name);
    this.setAttribute({ tabindex: 0 });
  }

  // add single option to the selector
  addOption(itemName, {
    value,
    isPlaceHolder,
    attributes,
  } = {
    isPlaceHolder: false,
    attributes: [],
  }) {
    const opt = document.createElement('option');
    opt.innerHTML = itemName;
    if (isPlaceHolder) {
      opt.selected = true;
      opt.disabled = true;
      opt.value = '';
      opt.hidden = true;
    } else {
      opt.value = value || itemName;
    }
    this.setAttribute(attributes, opt);
    this.addChild(opt);
  }

  // add multiple options
  addOptions(options, {
    itemParser,
  } = {
    itemParser: (item) => item,
  }) {
    this.removeAllOptions();
    for (let i = 0; i < options.length; i += 1) {
      const item = itemParser(options[i]);
      const itemName = typeof (item) === 'string' ? item : item.text;
      const value = typeof (item) === 'string' ? item : item.value;
      this.addOption(itemName, { value, attributes: { 'data-value': value } });
    }
    if (options.length > 0) {
      this.enable();
    }
  }

  addPlaceHolder(text) {
    this.addOption(text, { isPlaceHolder: true });
  }

  onChange(callback) {
    this.addEvent('change', (e) => {
      const { target: { value } } = e;
      callback(value, e);
    });
  }

  getSelectedValue() {
    return this.element.selectedIndex > 0
    ? this.element.options[this.element.selectedIndex].value
    : null;
  }

  // to enable a disabled dropdown selector
  enable() {
    this.element.disabled = false;
  }

  // disable dropdown if previous dropdown isn't selected, as per specifications
  disable() {
    this.element.disabled = true;
  }

  // clear dropdown options and disable it
  removeAllOptions() {
    for (let i = this.element.options.length - 1; i >= 0; i -= 1) {
      this.element.remove(i);
    }
    this.addPlaceHolder(this.name);
    this.disable();
  }
}

export default {
  DomElement,
  DropdownElement,
};
