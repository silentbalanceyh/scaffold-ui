import Ux from 'ux';

const readMessage = (reference, keys = []) => {
    Ux.ajaxPut("/api/message/batch/:status", { status: "HISTORY",$body: keys }).then(response => {
        let { $data = [] } = reference.state ? reference.state: {};
        $data = Ux.clone($data);
        $data.filter(item => keys.includes(item.key))
            .forEach(item => item.status = "HISTORY");
        Ux.of(reference).in({$data}).done();
    });
}

export default {
    rxVisible: (reference) => () => {
        const { $visible = false } = reference.state ? reference.state : {};
        if($visible){
            Ux.of(reference).hide().done();
        }else{
            Ux.of(reference).open().done();
        }
    },
    rxRead: (reference, item) => (event) => {
        Ux.prevent(event);
        const keys = [];
        keys.push(item.key);
        readMessage(reference, keys);
    },
    rxReadAll: (reference) => (event) => {
        Ux.prevent(event);
        const { $data = []} = reference.state ? reference.state: {};
        const keys = $data.map(item => item.key);
        readMessage(reference, keys);
    },
    rxDelete: (reference) => (event) => {
        Ux.prevent(event);
        const { $data = []} = reference.state ? reference.state: {};
        const keys = $data.map(item => item.key);
        Ux.ajaxDelete("/api/message/batch", keys).then(removed => {
            Ux.of(reference).in({$data:[]}).done();
        });
    }
}