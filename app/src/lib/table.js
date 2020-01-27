export const expandCeil = addedClass => event => {
    const [divNode, textArea] = event.currentTarget.childNodes;
    const text = divNode.textContent;
    textArea.value = text;
    textArea.classList.add(addedClass);
    textArea.focus();
};
export const shrinkCeil = addedClass => event => {
    const textArea = event.target;
    textArea.classList.remove(addedClass);
};
