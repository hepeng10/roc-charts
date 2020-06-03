// 注册插件
import Chart from '../core';

// 这几个是比较重要的插件，最好都实例化
import NodeClick from './NodeClick';
import NodeDrag from './NodeDrag';
import BlankClick from './BlankClick';
import BlankDrag from './BlankDrag';
import ScaleOnPC from './ScaleOnPC';
import ScaleOnMobile from './ScaleOnMobile';

import LassoSelect from './LassoSelect';
import FullScreen from './FullScreen';
import ChangeChart from './ChangeChart';
import RightKey from './RightKey';
import NodeInfo from './NodeInfo';
import SearchNode from './SearchNode';
import ChangeNodeDrag from './ChangeNodeDrag';
import ChangeAnimation from './ChangeAnimation';
import HideSelectedNodes from './HideSelectedNodes';
import DeleteSelectedNodes from './DeleteSelectedNodes';
import ShortestPath from './ShortestPath';
import ChangeLineWidth from './ChangeLineWidth';
import Reset from './Reset';
import SaveImg from './SaveImg';

// 系统重要插件
Chart.registerPlugin(NodeClick);
Chart.registerPlugin(NodeDrag);
Chart.registerPlugin(BlankClick);
Chart.registerPlugin(BlankDrag);
Chart.registerPlugin(ScaleOnPC);
Chart.registerPlugin(ScaleOnMobile);

// 工具栏插件
Chart.registerPlugin(FullScreen);
Chart.registerPlugin(LassoSelect);
Chart.registerPlugin(HideSelectedNodes);
Chart.registerPlugin(DeleteSelectedNodes);
Chart.registerPlugin(ChangeNodeDrag);
Chart.registerPlugin(ChangeAnimation);
Chart.registerPlugin(ShortestPath);
Chart.registerPlugin(SearchNode);
Chart.registerPlugin(SaveImg);
Chart.registerPlugin(Reset);
Chart.registerPlugin(ChangeChart);
Chart.registerPlugin(ChangeLineWidth);

// 其它 dom 元素插件
Chart.registerPlugin(RightKey);
Chart.registerPlugin(NodeInfo);
