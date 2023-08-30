import BpmnJs from 'bpmn-js';
import Event from './event';

const drawViewer = (viewer, reference) => {
    const {
        data = "",
    } = reference.props;
    // 再加载数据
    if (data) {
        viewer.importXML(data);
    }
}
export default {
    componentInit: (reference) => {
        // 获取 container 引用
        const container = reference.containerRef.current;

        reference.viewer = new BpmnJs({
            // customize text
            textRenderer: {
                defaultStyle: {
                    fontSize: 14
                }
            },
            container
        });

        // 事件绑定
        reference.viewer.on('import.done',
            Event['import.done'](reference));

        drawViewer(reference.viewer, reference);
    },
    componentUp: (reference, previous) => {
        const viewer = reference.viewer;
        if(viewer){
            drawViewer(viewer, reference);
        }
    }
}