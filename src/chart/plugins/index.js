// 注册插件
import Plugins from '../core/plugin';

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
Plugins.register(NodeClick);
Plugins.register(NodeDrag);
Plugins.register(BlankClick);
Plugins.register(BlankDrag);
Plugins.register(ScaleOnPC);
Plugins.register(ScaleOnMobile);

// 工具栏插件
Plugins.register(FullScreen);
Plugins.register(LassoSelect);
Plugins.register(HideSelectedNodes);
Plugins.register(DeleteSelectedNodes);
Plugins.register(ChangeNodeDrag);
Plugins.register(ChangeAnimation);
Plugins.register(ShortestPath);
Plugins.register(SearchNode);
Plugins.register(SaveImg);
Plugins.register(Reset);
Plugins.register(ChangeChart);
Plugins.register(ChangeLineWidth);

// 其它 dom 元素插件
Plugins.register(RightKey);
Plugins.register(NodeInfo);
