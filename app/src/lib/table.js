export const expandCeil = event => {
    const [divNode, textArea] = event.currentTarget.childNodes;
    const text = divNode.textContent;
    textArea.value = text;
    textArea.classList.add(css.overflowCeilVisible);
    textArea.focus();
};
export const shrinkCeil = event => {
    const textArea = event.target;
    textArea.classList.remove(css.overflowCeilVisible);
};