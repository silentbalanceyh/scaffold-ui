import { DocumentEditor } from "@onlyoffice/document-editor-react";
import Ux from 'ux';
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
                        }}/>
    )
}
export default {
    renderEditor,
}