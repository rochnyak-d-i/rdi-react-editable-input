import React, {Fragment, Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import fakePaste from './fakePaste';

export default class ContentEditable extends Component {
  constructor(props) {
    super(props);
  
    this.inputRef = React.createRef();
    this.__throttleInput = this.__throttleInput.bind(this);
    this.onPaste = this.onPaste.bind(this);
  }

  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    html: PropTypes.string,
    disabled: PropTypes.bool,
    delay: PropTypes.number,
    tag: PropTypes.string,
    attrs: PropTypes.object,

    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onMouseUp: PropTypes.func
  }

  static defaultProps = {
    disabled: false,
    placeholder: 'Write text',
    html: '',
    delay: 100,
    tag: 'div'
  }

  componentDidMount() {
    this.__$root = window;
  }
  componentDidUpdate() {
    if (this.inputRef.current !== document.activeElement) {
      return;
    }

    this.focusEndCursor();
  }
  shouldComponentUpdate(nextProps) {
    const updatedHTML = (this.inputRef.current &&
      this.inputRef.current.innerHTML !== nextProps.html);

    if (
      updatedHTML
      || nextProps.disabled !== this.props.disabled
      || nextProps.delay !== this.props.delay
      || nextProps.className !== this.props.className
    ) {
      return true;
    }

    return false;
  }

  focusEndCursor() {
    const element = this.inputRef.current;

    if (!element) {
      return;
    }

    const selection = document.getSelection();
    const range = document.createRange();

    range.selectNodeContents(element);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);

    const topOffset = element.getBoundingClientRect().top;
    const viewportHeight = document.documentElement.clientHeight;

    // Элемент за пределами видимой области
    if (topOffset < 0 || topOffset > viewportHeight) {
      this.__$root.scrollBy(0, topOffset - 60);
    }
  }

  __throttleInput() {
    if (this.__timer) {
      clearTimeout(this.__timer);
    }

    this.__timer = setTimeout(() => {
      this.onInput();
      clearTimeout(this.__timer);
    }, this.props.delay);
  }

  onInput() {
    const element = this.inputRef.current;
    const html = element ? element.innerHTML : '';

    this.props.onChange(html);
  }

  onPaste() {
    fakePaste(() => this.onInput());
  }

  disableEvent(event) {
    event.preventDefault();
  }

  render() {
    const {placeholder, disabled, html, className, tag} = this.props;
    const {onFocus, onBlur, onKeyDown, onKeyUp, onMouseUp} = this.props;
    const innerProps = Object.assign({
      className: classNames('rdi-editable-input', className),
      ref: this.inputRef,
      contentEditable: !disabled,
      placeholder: placeholder,
      onInput: this.__throttleInput,
      onDrop: this.disableEvent,
      onPaste: this.onPaste,
      onFocus: onFocus,
      onBlur: onBlur,
      onKeyDown: onKeyDown,
      onKeyUp: onKeyUp,
      onMouseUp: onMouseUp,
      dangerouslySetInnerHTML: {__html: html}
    }, this.props.attrs);

    return React.createElement(tag, innerProps);
  }
}
