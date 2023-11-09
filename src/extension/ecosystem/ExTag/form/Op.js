import Ux from 'ux';
export default {
    actions:{
        $opTagAdd: (reference) => (params) => {
            const ref = Ux.onReference(reference, 1);
            const { dataTag } = ref.props;
            const request = Ux.clone(params);
            request.uiStyle = JSON.stringify({color:params.color});
            Object.assign(request, dataTag);
            return Ux.ajaxPost("/api/x-tag/m", request)
                .then(data => {
                    // Message
                    Ux.sexMessage(ref, "added");
                    // 关闭窗口
                    return Ux.of(reference).close(data);
                })
                .catch(error => Ux.ajaxError(reference, error));
        }
    }
}