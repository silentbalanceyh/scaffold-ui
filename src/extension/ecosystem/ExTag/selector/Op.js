import Ux from 'ux';

export default {
    yiSource: (reference) => {
        const state = {};
        return Ux.ajaxGet("/api/x-tag/by/sigma").then(tags => {
            state.$source = Ux.clone(tags);
            const { value = []} = reference.props;
            state.$selected = value;
            return Ux.promise(state);
        });
    },
    rxChecked: (reference) => (keys = []) => {
        const $selected = Ux.clone(keys);
        const state = {};
        state.$selected = $selected;
        Ux.of(reference).in(state).done();
    },
    rxSubmit: (reference) => (event) => {
        const ref = Ux.onReference(reference, 1);
        const { config = {}} = reference.props;
        return Ux.of(ref).loading().future(() => {
            const { $selected = []} = reference.state;
            // 走一个后端接口，提交标签的关联信息
            return Ux.ajaxPost("/api/x-tag/m/:identifier/:key",{
                identifier: config.entityType,
                key: config.entityId,
                $body: $selected
            });
        }).then(($data = []) => {
            Ux.sexMessage(reference, "saved");

            return Ux.ajaxGet("/api/x-tag/m/:identifier/:key", {
                identifier: config.entityType,
                key: config.entityId
            })
        }).then(($data) => Ux.of(ref)
            .in({$data})
            .hide().load()
            .future()
        )
    }
}