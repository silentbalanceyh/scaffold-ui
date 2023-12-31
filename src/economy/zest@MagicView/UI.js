/**
 * ## 「组件」`MagicView`
 *
 * 数组录入组件
 *
 * ```js
 * import { MagicView } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * #### 0.1. 时间
 *
 * ```json
 * {
 *      "metadata": "infoAt,记录时间,10,,aiMagic",
 *      "optionJsx.config.format": "YYYY年MM月DD日 HH:mm",
 *      "moment": true
 * }
 * ```
 *
 * #### 0.2. Ajax加载
 *
 * ```json
 * {
 *      "metadata": "logUser,记录人,14,,aiMagic",
 *      "optionJsx.config.user": {
 *          "uri": "/api/user/:key",
 *          "field": "realname"
 *      },
 *      "optionJsx.$empty": "（系统）"
 * }
 * ```
 *
 * #### 0.3. 带图标选项
 *
 * ```json
 * {
 *      "metadata": "level,级别,10,,aiMagic",
 *      "optionJsx.config.items": [
 *          "INFO,信息:info-circle,16:#6495ED",
 *          "WARN,警告:warning,16:#EEB422",
 *          "ERROR,错误:issues-close,16:#EE2C2C"
 *      ]
 * }
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Object|Ant Form给当前组件传入的值。|
 * |format||props|String|时间格式专用格式化的Pattern（开发模式）。|
 * |$empty||props|String|如果数据为空则使用空的字符串呈现。|
 * |config|items|props|Array|静态选项。|
 * |config|datum|props|String/Object|动态选项。|
 * |config|moment|props|Boolean|是否时间格式。|
 * |config|boolean|props|Boolean|是否Boolean类型。|
 * |config|table|props|Object|表格渲染专用配置。|
 * |config|expr|props|String|「特定配置」table不存在时，使用表达式模式。|
 * |config|currency|props|String/Object|「特定配置」table不存在，并且不带expr，则直接使用currency。|
 * |config|format|props|String|时间格式专用格式化的Pattern（配置模式）。|
 * |config|user|props|Object|Ajax配置，原生配置是为创建人、更新人量身打造，所以该配置目前使用`user`。|
 * |config|record|props|Boolean|是否执行记录解析，使用Json模式呈现。|
 * |config|rxRecord|props|Function|记录解析函数，配合record配置使用。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 货币双格式
 *
 * currency有两种格式，默认是字符串，还有下边格式：
 *
 * ```json
 * {
 *     "unit": "货币单位",
 *     "right": "是否位于右侧"
 * }
 * ```
 *
 * * 默认格式：`String`也是这个格式，`<单位><值>`。
 * * right = true：`<值><单位>`。
 *
 * #### 3.2. Icon格式
 *
 * 示例格式：
 *
 * `INFO,信息:info-circle,16:#6495ED`
 *
 * 上述格式转换成：
 *
 * `<值>,<显示文字:图标类型>,<图标尺寸:图标颜色>`
 *
 *
 * @memberOf module:uca/zest
 * @method MagicView
 */
// =====================================================
// componentInit/componentUp
// =====================================================

export {MagicView} from 'zs';