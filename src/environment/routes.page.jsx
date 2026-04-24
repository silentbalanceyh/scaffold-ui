import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {PureComponent, useEffect, useState} from "react";
// Ant Design
import {theme, Spin} from 'antd';
import Ux from "ux";
// Redux ( Store )
// Zero Framework ( Model & Ux )
import {Dsl} from "entity";
// ----------------------------- Route Data ----------------------------------
import storeGlobal from "./store";
import ROUTE_DATA from "../route";
// ----------------------------- import above ----------------------------------
const {useToken} = theme;
// ----------------------------- hooks function component ----------------------------------

const toRouteKey = (modulePath, prefix) => {
    const relative = modulePath
        .replace(prefix, "")
        .replace(/\/UI\.(js|jsx|ts|tsx)$/, "");
    return relative
        .replace(/\./g, '')
        .replace(/-/g, '$')
        .replace(/\//g, '_');
};

const buildLoaderMap = (modules, prefix) => {
    const loaderMap = {};
    Object.keys(modules).forEach((modulePath) => {
        loaderMap[toRouteKey(modulePath, prefix)] = modules[modulePath];
    });
    return loaderMap;
};

const CONTAINER_LOADERS = buildLoaderMap(
    import.meta.glob(["../container/**/UI.js"]),
    "../container"
);
const COMPONENT_LOADERS = {
    ...buildLoaderMap(
        import.meta.glob(["../components/**/UI.js"]),
        "../components"
    ),
    ...buildLoaderMap(
        import.meta.glob(["../extension/components/**/UI.js"]),
        "../extension/components"
    ),
    ...buildLoaderMap(
        import.meta.glob(["../extension/cerebration/**/UI.js"]),
        "../extension/cerebration"
    ),
};

const getContainerKey = (module, page) => {
    const keyContainer = `_${module}_${page}`;
    if (CONTAINER_LOADERS[keyContainer]) {
        return keyContainer;
    }
    if (ROUTE_DATA[keyContainer]) {
        return ROUTE_DATA[keyContainer];
    }
    return ROUTE_DATA.defined;
};

const getComponentKey = (module, page) => {
    // 先做 Container 基本运算
    page = page.replace("-", "$");  // 特殊规则
    return `_${module}_${page}`;
};

const createMissingComponent = (keyComponent) => class Component extends PureComponent {
    render() {
        return (<div>{keyComponent} 页面未找到！</div>);
    }
};

const loadPagePair = async (module, page) => {
    const keyContainer = getContainerKey(module, page);
    const keyComponent = getComponentKey(module, page);
    const layoutLoader = CONTAINER_LOADERS[keyContainer] || CONTAINER_LOADERS[ROUTE_DATA.defined];
    const componentLoader = COMPONENT_LOADERS[keyComponent];
    const [layoutModule, componentModule] = await Promise.all([
        layoutLoader(),
        componentLoader ? componentLoader() : Promise.resolve({default: createMissingComponent(keyComponent)}),
    ]);
    return {
        Layout: layoutModule.default || layoutModule,
        Page: componentModule.default || componentModule,
    };
};

const renderPage = (Layout, Page, useHook = {}) => {
    const {token, location, navigate, params} = useHook;
    // DataRouter Building;
    const router = Dsl.getRouter({
        location,           // V5 Fix
        navigate,
        match: {params}     // V5 Fix
    }, Component);

    // Attributes
    const attrs = {};
    attrs.skin = token;
    attrs.store = storeGlobal;
    attrs.$router = router;
    attrs.component = Page;

    const V4App = Ux.V4App;
    return (
        <div>
            <V4App/>
            <Layout {...attrs}/>
        </div>
    );
};

const renderLoading = () => (
    <div style={{padding: 48, textAlign: "center"}}>
        <Spin size="large"/>
    </div>
);

const useResolvedPage = (module, page) => {
    const [state, setState] = useState({
        ready: false,
        Layout: null,
        Page: null,
    });

    useEffect(() => {
        let active = true;
        setState({
            ready: false,
            Layout: null,
            Page: null,
        });
        loadPagePair(module, page).then(({Layout, Page}) => {
            if (active) {
                setState({
                    ready: true,
                    Layout,
                    Page,
                });
            }
        });
        return () => {
            active = false;
        };
    }, [module, page]);

    return state;
};

const PageAuthorized = (props) => {
    const token = useToken();
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    // 访问核心路由 /api/app 获取当前应用的基本信息（专用接口）
    // const [ready, setReady] = useState(false);

    /*
     * 使用 useEffect 处理异步步骤，切换应用的场景分析
     * 1. 左上角切换应用时会自动走入 useEffect，实际是切换的路由地址，因此会触发 useEffect 中的函数执行，获取新的应用信息并更新状态。
     * 2. 存储应用本身只影响跳转地址，但实际路由地址本身和 appId 没有关系，简单说
     *    {appId-01}/module/page
     *    {appId-02}/module/page
     *    上述两个地址是一样的，但最终逻辑可能会不相同
     * 3. 远程请求只认 Z_APP 环境变量中配置的地址，不认其他地址。
     */
    // useEffect(() => {
    //     const initializeApp = async (appId) => {
    //         const appData = await Ux.ajaxGet("/api/app");
    //         setReady(true);
    //     };
    //     initializeApp(params.app)
    // }, [params.app]);

    const resolved = useResolvedPage(params.module, params.page);
    if (!resolved.ready) {
        return renderLoading();
    }
    return renderPage(resolved.Layout, resolved.Page, {token, location, navigate, params});
}

const PageLogin = (props) => {
    const token = useToken();
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const resolved = useResolvedPage("login", "index");
    const path = location.pathname;
    const isLoginPath = "/" === path || path.endsWith("/login/index");
    if (isLoginPath) {
        if (!resolved.ready) {
            return renderLoading();
        }
        return renderPage(resolved.Layout, resolved.Page, {token, location, navigate, params});
    }
    return false;
}
/**
 * 页面路由组件，负责根据路由参数加载对应的页面组件
 * @param props 路由组件的props，包含路由参数等信息
 * @return {JSX.Element}
 */
const PageRoute = (props) => {
    const {authorized = true} = props;
    if (authorized) {
        return <PageAuthorized {...props} />
    } else {
        return <PageLogin {...props} />
    }
}

export default PageRoute;
