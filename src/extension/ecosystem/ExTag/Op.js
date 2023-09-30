import Ux from 'ux';

const __rxRefresh = (reference) => {
    const { config = {}} = reference.props;
    // 初始化 $data = [] 部分的数据，加载
    Ux.ajaxGet("/api/x-tag/m/:identifier/:key",{
        identifier: config.entityType,
        key: config.entityId
    }).then(response => {
        const state = {};
        state.$data = response;
        Ux.of(reference).in(state).ready().done();
    })
}
export default {
    event:{
        rxOpen: (reference) => (event) => {
            Ux.of(reference).open().done();
        },
        rxConfirm: (reference, item) => (event) =>
            // 删除 tag 记录，删除之前先调用上层的 防抖 执行
            Ux.of(reference)._.submitting()
            // 删除当前 Tag
            .then(() => {
                const { config } = reference.props;
                return Ux.ajaxDelete("/api/x-tag/m/:identifier/:key/:tag",{
                    identifier: config.entityType,
                    key: config.entityId,
                    tag: item.key
                });
            })
            // 更新当前 $data
            .then(() => {
                const { $data = []} = reference.state;
                const $removed = $data.filter(each => each.key !== item.key);
                return Ux.of(reference).in({$data:$removed})
                    .future(() => Ux.promise(item));
            })
            // 删除成功之后的处理
            .then(nil => Ux.of(reference)._.submitted())
        ,
        rxRefresh: (reference) => (event) => __rxRefresh(reference)
    },
    yiTag: (reference) =>  __rxRefresh(reference)
}