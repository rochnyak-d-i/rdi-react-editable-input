import clearText from './clearText';

const ALLOWS_PASTE_HTML = {
  tags: ['b', 'i', 'u', 'em', 'a', 'br', 'div', 'p', 'sup', 'sub'],
  attributes: {
    a: ['href']
  }
};

export default function fakePaste(callback) {
  const selection = document.getSelection();
  const fakeNode = document.createElement('span');
  const range = document.createRange();
  const savedRange = selection.getRangeAt(0);

  // вставка скрытого подставного элемента
  fakeNode.setAttribute('contenteditable', true);
  fakeNode.style.overflow = 'hidden';
  fakeNode.style.position = 'absolute';
  fakeNode.style.zIndex = '-1';
  fakeNode.style.width = '1px';
  fakeNode.style.height = '1px';
  document.body.appendChild(fakeNode);

  // фокус на подставном элементе
  range.selectNodeContents(fakeNode);
  selection.removeAllRanges();
  selection.addRange(range);

  setTimeout(() => {
    fakeNode.innerHTML = clearText(
      fakeNode.innerHTML, ALLOWS_PASTE_HTML);

    fakeNode.removeAttribute('contenteditable');
    fakeNode.removeAttribute('style');
    document.body.removeChild(fakeNode);

    // восстановление каретки
    savedRange.deleteContents();
    savedRange.insertNode(fakeNode);
    selection.removeAllRanges();
    selection.addRange(savedRange);

    callback();
  }, 0);
}
