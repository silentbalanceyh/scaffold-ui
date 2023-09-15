import { DocumentEditor } from "@onlyoffice/document-editor-react";
import Ux from 'ux';
import Op from './Op';
const renderEditor = (reference) => {
    const { $config = {}} = reference.state;

    const attrs = {};
    attrs.id = 'viewerDocument';
    attrs.documentServerUrl = Ux.Env.DOC_SERVER;
    attrs.config = $config;
    console.log(attrs);
    return (
        <DocumentEditor {...attrs}
                        events_onDocumentReady={event => {
                            console.log("Finished");
                        }}
                        onLoadComponentError={Op.onLoadComponentError(reference)}
        />
    )
}
export default {
    renderEditor,
}