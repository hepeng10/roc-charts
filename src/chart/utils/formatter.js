import { nodeConfig } from '../config/config';
// 设置节点属性
export const setNodeAttr = (node, position, size) => {
    node.position = position;
    node.style = { ...nodeConfig.size[size], ...node.style };
};
// 将字符串按每行 len 的长度添加换行符
export const linefeed = (str, len) => {
    let reg = new RegExp(`(.{${len}})`, 'g');
    return ('' + str).replace(reg, '$1\n');
    // return ('' + str).replace(/\n/g, '').replace(reg, '$1\n');
};

// id 不同 name 相同的，将 name 改为 name(1) name(2) 这样的格式
export const addAlias = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (nodes[i].name === nodes[j].name && nodes[i].id !== nodes[j].id) {
                const preIndex = nodes[i].nameIndex;
                if (preIndex === 0) {
                    nodes[i].nameIndex = 1;
                    nodes[i].name = `${nodes[i].bakName}(${nodes[i].nameIndex})`;
                    nodes[j].nameIndex = 2;
                    nodes[j].name = `${nodes[j].bakName}(${nodes[j].nameIndex})`;
                } else {
                    nodes[j].nameIndex = preIndex + 1;
                    nodes[j].name = `${nodes[j].bakName}(${nodes[j].nameIndex})`;
                }
            }
        }
    }
};
