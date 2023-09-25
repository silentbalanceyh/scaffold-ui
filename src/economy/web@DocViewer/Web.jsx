import {DocumentEditor} from "@onlyoffice/document-editor-react";
import Ux from 'ux';

import Op from './Op';

const renderEditor = (reference) => {
    const {$config = {}} = reference.state;

    const attrs = {};
    attrs.id = 'viewerDocument';
    attrs.key = "viewerDocument";
    attrs.documentServerUrl = Ux.Env.DOC_SERVER;
    attrs.config = $config;
    return (
        <div>
            <DocumentEditor {...attrs}
                            {...Op.onEvent(reference, {
                                config: $config,
                                id: attrs.id,
                            })}
                            onLoadComponentError={Op.onLoadComponentError(reference)}
            />
        </div>
    )
}
export default {
    renderEditor,
}