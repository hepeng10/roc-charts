export const sceneConfig = {
    scale: {
        max: 2,
        min: .05,
        step: .05
    }
};

export const nodeConfig = {
    color: 'pink',
    selectedColor: '#66B3FF',
    size: {
        small: {
            r: 10,
        },
        normal: {
            r: 20,
        },
        large: {
            r: 30,
        }
    },
    sub: {
        r: 6,
    },
    interval: 3,  // name, subImage 等与节点的间隔
    fadeOpacity: .1,
};

export const textConfig = {
    align: 'center',
    verticalAlign: 'middle',
    color: '#666',
    fontSize: 12,
};

export const linkConfig = {
    side: 10,  // 箭头的边长
    lineWidth: 1,
    color: '#F1D07B',
    twoWayColor: '#EE7768',
    optimize: 200,
};
