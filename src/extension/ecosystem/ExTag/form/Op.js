import Ux from 'ux';
export default {
    actions:{
        $opTagAdd: (reference) => (params) => {
            const ref = Ux.onReference(reference, 1);
            const { dataTag } = ref.props;
            const request = Ux.clone(params);
            request.uiStyle = JSON.stringify({color:params.color});
            Object.assign(request, dataTag);
            return Ux.ajaxPost("/api/x-tag", request)
                .then(data => Ux.ajaxDialog(reference, {data, key: "added"}))
                .then(response => Ux.of(reference).close(response))
                .catch(error => Ux.ajaxError(reference, error));
        }
    }
}