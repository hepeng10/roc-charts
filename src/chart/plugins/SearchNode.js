import Base from '../core/plugin/Base';

import icon from '../images/pluginIcon/searchNode.svg';

export default class SearchNode extends Base {
    static pluginName = 'searchNode';

    btn;
    inputContainer;
    input;
    searchBtn;

    init() {
        this.initButton();
        this.initInput();
        this.addEvent();
    }

    initButton() {
        this.btn = this.createButton({
            icon,
            name: '搜索节点',
            info: '搜索节点'
        });
        this.btn.elem.classList.add('searchNodeBtn-roc');
    }

    initInput() {
        const inputContainer = document.createElement('span');
        inputContainer.classList.add('searchNodeContainer-roc');
        const input = document.createElement('input');
        input.setAttribute('placeholder', '请输入节点名称');
        input.classList.add('searchNodeInput-roc');
        const btn = document.createElement('span');
        btn.classList.add('searchNodeSearchBtn-roc');
        inputContainer.appendChild(input);
        inputContainer.appendChild(btn);
        this.btn.elem.appendChild(inputContainer);

        this.inputContainer = inputContainer;
        this.input = input;
        this.searchBtn = btn;
    }

    addEvent() {
        this.btn.onClick(() => {
            this.onClick();
        });

        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
        }, false);

        this.input.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                this.searchNode();
            }
        }, false);

        this.searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.searchNode();
        }, false);
    }

    onClick() {
        if (this.btn.active) {
            this.inputContainer.style.display = 'block';
        } else {
            this.inputContainer.style.display = 'none';
        }
    }

    searchNode() {
        const name = this.input.value;
        const { nodes } = this.$store;
        let nodesID = [];
        nodes.forEach((node) => {
            if (node.name.includes(name)) {
                nodesID.push(node.id);
            }
        });
        this.$chart.util.highlightNodes(nodesID);
    }
}
