/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-quill components
// react-quill styles
// import "react-quill/dist/quill.snow.css";

// Custom styles for the MDEditor
import MDEditorRoot from "components/MDEditor/MDEditorRoot";

// Material Dashboard 2 PRO React context
import { useMaterialUIController } from "context";

function MDEditor(): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <MDEditorRoot ownerState={{ darkMode }}>
      {/* <ReactQuill theme="snow" {...props} /> */}
    </MDEditorRoot>
  );
}

export default MDEditor;
