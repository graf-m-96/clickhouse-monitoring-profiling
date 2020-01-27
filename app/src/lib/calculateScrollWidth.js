export default () => {
    const div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.position = 'fixed';
    div.style.top = '-100px';
    div.style.left = '-100px';

    document.body.append(div);
    const width = div.offsetWidth - div.clientWidth;
    div.remove();

    return width;
};
