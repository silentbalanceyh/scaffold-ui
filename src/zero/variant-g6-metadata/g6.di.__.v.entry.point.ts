import {GRequest} from "./g6.__.c.pojo.g.request";

export enum DiMap {
    // 返回处理后的 item
    onNodeInitBefore = 'onNodeInitBefore',      // 节点创建时初始化之前调用
    onNodeInitAfter = 'onNodeInitAfter',        // 节点创建时初始化之后调用
    onEdgeInitBefore = 'onEdgeInitBefore',      // 关系创建时初始化之前调用
    onEdgeInitAfter = 'onEdgeInitAfter',        // 关系创建时初始化之后调用

    /**
     * 拉线连接部分的事件
     * 如果 onEdgeConnectedBefore 返回 true，则继续执行，并且触发 After
     * 如果 onEdgeConnectedBefore 返回 false，删除掉刚刚创建的链接，不触发 After
     */
    onEdgeConnectedBefore = 'onEdgeConnectedBefore',    // 连接完成之前操作
    onEdgeConnectedAfter = 'onEdgeConnectedAfter',      // 连接成功过后操作

    onNodeAddAfter = 'onNodeAddAfter',                  // 创建新节点过后的操作
    onNodeClick = 'onNodeClick',                        // 点击
    onNodeClickDouble = 'onNodeClickDouble',            // 点击

    onWindowClose = 'onWindowClose',                    // 窗口关闭函数
    onWindowSubmit = 'onWindowSubmit',                  // 窗口提交函数

    onNodeRemovable = 'onNodeRemovable',                // 当前元素是否可删除，为 true 则可删除，才显示删除按钮
    onEdgeRemovable = 'onEdgeRemovable',                // 当前线是否可删除，为 true 则可删除，才显示删除按钮

    // Command 命令部分
    onSubmit = 'onSubmit',                              // 提交专用函数
    onReset = 'onReset',                                // 重置专用操作
    onTpl = 'onTpl',                                    // 模板处理
    onZoomIn = 'onZoomIn',                              // 放大
    onZoomOut = 'onZoomOut',                            // 缩小

    /*
     * 新函数，做过滤用的
     */
    onNodeFilter = 'onNodeFilter',                      // 过滤 Item 专用
}

const internalRequestFn = (input, gEvent) => new GRequest(gEvent.g6Graph());

const DI_ACTION = {}
/*
 * 提交专用数据，构造最终结果
 * 1）node
 * 2）edge
 * 3）graphic
 * 构造的数据结果：
 * {
 *     "nodes": [],
 *     "edges": [],
 *     "graphic": {}
 * }
 */
DI_ACTION[DiMap.onSubmit] = internalRequestFn;
DI_ACTION[DiMap.onReset] = (input, gEvent) => {
    const graph = gEvent.g6Graph();
    graph.zoomTo(1);
    return new GRequest(graph);
};
DI_ACTION[DiMap.onTpl] = internalRequestFn;
DI_ACTION[DiMap.onZoomIn] = (input, gEvent) => {
    const graph = gEvent.g6Graph();
    let zoom = graph.zoom();
    zoom += 0.1;
    if (zoom > 1.5) {
        zoom = 1.5;
    }
    graph.zoomTo(zoom);
    return new GRequest(graph);
}
DI_ACTION[DiMap.onZoomOut] = (input, gEvent) => {
    const graph = gEvent.g6Graph();
    let zoom = graph.zoom();
    zoom -= 0.1;
    if (zoom < 0.5) {
        zoom = 0.5;
    }
    graph.zoomTo(zoom);
    return new GRequest(graph);
}
/*
 * 节点执行流程
 * 1）数据本身 ->
 * 2）执行 onNodeInitBefore ->
 * 3）构造节点信息（g6格式）->
 * 4）根据不同需要计算 shape 类型，当前系统中是 node-ci 在使用
 * -- 这个值可以根据 stencil 中的配置数据来
 */
const DI_NAME = [
    DiMap.onNodeInitBefore,
    DiMap.onNodeInitAfter,
    DiMap.onEdgeInitBefore,
    DiMap.onEdgeInitAfter,

    DiMap.onEdgeConnectedBefore,
    DiMap.onEdgeConnectedAfter,
    DiMap.onNodeAddAfter,
    DiMap.onNodeClick,
    DiMap.onNodeClickDouble,

    DiMap.onWindowClose,
    DiMap.onWindowSubmit,

    DiMap.onNodeRemovable,
    DiMap.onEdgeRemovable,

    DiMap.onNodeFilter,

    DiMap.onSubmit,
    DiMap.onReset,
    DiMap.onTpl,
    DiMap.onZoomIn,
    DiMap.onZoomOut,
];
export {DI_NAME, DI_ACTION};