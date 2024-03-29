import React from 'react'
import Ex from "ex";
import Ux from 'ux';
import {Form} from "antd";
import Op from './Op';

/**
 * ## 「组件」`ExForm`
 *
 * ```js
 * import { ExForm } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 * ### 2. 核心
 *
 * React属性props：
 *
 * ```js
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据,
 *      fnOut: 专用 redux 写树函数,
 *      form: Ant-Design Form,
 *      $actions: {
 *          $opProfile ( id = opProfile, function = $opProfile )
 *      },
 *      config:{
 *          dialog: {
 *              modal: { 窗口数据 }
 *              title: { 窗口标题 }
 *          },
 *          form: {
 *              原始配置 _form 中的内容
 *          }
 *      },
 *      $height: "200px",
 *      $inited: {
 *          初始值
 *      }
 * }
 * ```
 *
 * React属性state:
 *
 * ```js
 * {
 *      $ready: "当前组件是否可渲染？配置处理完成",
 *      $loading: "当前表单提交状态（防重复提交）",
 *      $metadata: {}
 *      $action: {
 *          opProfile: true ( id = opProfile )
 *      },
 *      raft: {
 *          enabled: 启用Raft表单模式,
 *          form:{ },
 *          hidden: { inputs:[] },
 *          options: { },
 *          rows: [
 *              []
 *          ]
 *      }
 * }
 * ```
 *
 * @memberOf module:uca/extension
 * @method ExForm
 */
const UCA_NAME = "ExForm";

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    // this.formRef.current -> this.props.form
    formRef = React.createRef();
    state = {
        $ready: false
    };

    componentDidMount() {
        const reference = this;
        /*
         * 此处做初始化处理，追加生命周期到环境中
         * rxMountAfter 函数会在初始化执行之后执行 state 的最终修改流程
         * 且为 Promise 流程，并且是 ExForm 组件独有的流程
         */
        Ux.raftForm(reference).then(state => {
            const {rxMountAfter} = reference.props;
            if (Ux.isFunction(rxMountAfter)) {
                return rxMountAfter(state, reference);
            } else {
                return Ux.promise(state);
            }
        }).then(Ux.ready).then(Ux.pipe(reference));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.componentUp(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this,
            () => Ux.aiForm(this),
            Ex.parserOfColor(UCA_NAME).form())
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
    const [form] = Form.useForm();
    return (<Component {...props} form={form}/>)
}