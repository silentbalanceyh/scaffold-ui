import Ux from 'ux';
// eslint-disable-next-line import/no-anonymous-default-export
export default (reference, editorConfig) => {
    const event = {};
    // events_onDocumentReady
    event.events_onDocumentReady = (event) => {
        const { $events } = reference.props;
        const rxDocumentReady = $events?.rxDocumentReady;
        if(Ux.isFunction(rxDocumentReady)){
            rxDocumentReady(event, reference);
        }
    }
    // events_onInfo
    event.events_onInfo = (event) => {
        // rxInfo = (reference) => (DocEditor)
    }
    return event;
}