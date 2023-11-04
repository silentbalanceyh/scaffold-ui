import Ux from 'ux';

const __configMix = (tabs = {}, config = {}) => {
    const {
        ref, workflow = {}
    } = config;
    // 文字：设置
    const button = Ux.inHoc(ref, "button");
    // 工作流配置
    const configW = workflow.config ? workflow.config : {};
    {
        // items 更新
        const linkagePage = configW.ui?.linkage ? configW.ui?.linkage : [];
        const linkageConfig = configW.linkage ? configW.linkage : {};

        const vItems = tabs.items.split(";");
        const vPages = Ux.clone(tabs.pages);
        linkagePage.forEach(page => {
            const pageConfig = linkageConfig[page]?.config;
            if (pageConfig.page) {
                const title = pageConfig.page;
                // 只有 config.page 存在的时候才执行动态扩展
                vItems.push(`${title},${page}`);
                // 对象构造
                vPages[page] = {
                    ui: [
                        [
                            `title=${button.setting ? button.setting : ''}${title}`
                        ],
                        [
                            `${page},,24`
                        ]
                    ]
                };
            }
        });
        /*
         * pages, items 双属性处理
         */
        tabs.pages = vPages;
        tabs.items = vItems.join(';');
    }
    return tabs;
}
export default (ref) => ({
    monitorContainer: {
        rxCBefore: (config = {}, reference) => {
            /*
             * 由于是工作流部分，前置表单采用的是简化格式，非正式格式，目前只处理文本形式，
             * 此处执行判断来处理 items 最合适，最终生成格式化字符串
             */
            const items = config.items;
            const {$workflow = {}} = ref.props;
            if ("string" === typeof items) {
                return __configMix(config, {ref, reference, workflow: $workflow})
            } else {
                // TODO: 设置开发过程中另外格式的处理
            }
            return config;
        },
        /*
         * - ticket：关联工单
         * - bpmn：流程信息（必须）
         * - linkageAttachment      - 关联附件
         * - linkageAsset           - 关联资产
         * - linkageEmployee        - 关联员工
         */
        koTab: ($items = []) => {
            const {$workflow = {}} = ref.props;
            const {config = {}} = $workflow;
            const linkageMap = config.linkage ? config.linkage : {};
            // 默认 key 值
            const enabled = [
                "ticket",                   // 主单据
                "bpmn",                     // 流程图
                "linkageAttachment",        // 附件
            ]
            const {linkage = []} = config.ui ? config.ui : {};
            linkage.forEach(name => {
                if (linkageMap.hasOwnProperty(name)) {
                    enabled.push(name);
                }
            })
            const normalized = [];
            enabled.forEach(item => {
                const found = Ux.elementUnique($items, 'key', item);
                if (found) {
                    normalized.push(found);
                }
            })
            return normalized;
        }
    }
})