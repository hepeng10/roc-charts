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
            width: 20,
            height: 20,
        },
        normal: {
            r: 20,
            width: 40,
            height: 40,
        },
        large: {
            r: 30,
            width: 60,
            height: 60,
        }
    },
    extend: {
        show: true,
        r: 5,
        width: 10,
        height: 10
    },
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
    bothWayColor: '#EE7768',
};

// 套索工具颜色
export const selectArea = {
    backgroundColor: 'orange',
    borderColor: 'red',
};

export const optimizeLinksNum = 200;
