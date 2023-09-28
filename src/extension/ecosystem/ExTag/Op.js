import Ux from 'ux';
export default {
    event:{
        rxOpen: (reference) => (event) => {
            Ux.of(reference).open().done();
        }
    }
}