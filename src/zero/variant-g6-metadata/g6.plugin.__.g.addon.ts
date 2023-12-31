import {GLife, GView} from "./g6.__.c.interface.contract";
import {GStore} from "./g6.__.c.pojo.g.store";
import {GToolbar} from "./g6.plugin.__.g.addon.toolbar";
import {GStencil} from "./g6.plugin.__.g.addon.stencil";
import {GNode} from "./g6.__.c.element.g.node";
import {GCommand} from "./g6.__.c.event.g.command";

export class GAddOn implements GLife, GView {

    private readonly _gGraph: any = null;

    private readonly _uiToolbar: GToolbar = null;
    private readonly _uiStencil: GStencil = null;

    private _uiWindow: any = {};

    constructor(gGraph: any) {
        this._gGraph = gGraph;
        this._uiToolbar = new GToolbar(gGraph);
        this._uiStencil = new GStencil(gGraph);
    }

    uiToolbar = () => this._uiToolbar.ui();

    configure(store: GStore): GAddOn {
        this._uiToolbar.configure(store);
        this._uiStencil.configure(store);
        this._uiWindow = store.inWindow();
        return this;
    }

    initialize(gNode: GNode, gCommand: GCommand): GAddOn {
        // 更新 GPos
        this._uiToolbar.initialize(gCommand);
        // 连续初始化两次，内部直接初始化
        this._uiStencil.bind(gNode).initialize()

        return this;
    }

    id = (): any => {
        const id: any = {};
        id.toolbar = this._uiToolbar.id();
        id.stencil = this._uiStencil.id();
        return id;
    }

    css = (): any => {
        const css: any = {};
        css.toolbar = this._uiToolbar.css();
        css.stencil = this._uiStencil.css();
        return css;
    }

    // ------------------- 元素运算、读取、设置、过滤 -----------------
    stencilOn = (filterFn: Function) =>
        this._uiStencil.initializeData(filterFn);
    stencilReload = (name: string, filterFn: Function) =>
        this._uiStencil.reloadGroup(name, filterFn);
    // ------------------- 窗口专用函数处理
    winOpenState = ($inited: any = {}, state: any = {}) => {
        const {$openKey, ...rest} = state;
        const $openConfig = this._uiWindow[$openKey];
        return {
            ...rest,                    // $openId
            $openConfig,
            $inited,
            $visible: true,
        }
    }

    winCloseState = () => ({
        $inited: undefined,             // 表单初始化数据
        $visible: false,                // 是否显示弹框
        $openConfig: undefined,         // 窗口配置
        $openId: undefined,             // 对应的元素主键（Node/Edge）
        $openComponent: undefined       // 动态组件清空
    })
}