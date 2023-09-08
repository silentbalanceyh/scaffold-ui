import React from "react";
import {DocRenderer} from "../../index";
import ImageProxyRenderer from "../image";

const JPGRenderer: DocRenderer = (props) => <ImageProxyRenderer {...props} />;

JPGRenderer.fileTypes = ["gif", "image/gif"];
JPGRenderer.weight = 0;

export default JPGRenderer;
