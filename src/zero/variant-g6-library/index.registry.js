// 演示用流程图
import pptEdge from './registry.editor.ppt.edge';
import pptNode from './registry.editor.ppt.node';
// 配置项绘图专用
import ciNode from './registry.editor.ci.node';
import ciEdge from './registry.editor.ci.edge';
// 配置项查看专用
import ciNodeView from './registry.viewer.ci.node';
import ciEdgeView from './registry.viewer.ci.edge';

export default {
    // PPT 专用风格
    "node-ppt": pptNode,
    "edge-ppt": pptEdge,

    // 编辑器专用
    "node-ci": ciNode,
    "edge-ci": ciEdge,

    // 查看器专用
    "node-ci-view": ciNodeView,
    "edge-ci-view": ciEdgeView,
}