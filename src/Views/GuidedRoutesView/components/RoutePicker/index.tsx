import React from "react";
import { QuestionCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, FloatButton } from "antd";

import "./index.less";

const RoutePicker: React.FC = () => (
  <>
    {/* <FloatButton.Group shape="circle" style={{ right: 24 }}>
      <FloatButton icon={<QuestionCircleOutlined />} />
      <FloatButton />
      <FloatButton.BackTop visibilityHeight={0} />
    </FloatButton.Group> */}
    <FloatButton.Group
      shape="square"
      style={{ right: 40, bottom: 400 }}
      className="routeBtnGroup"
    >
      {/* <div className="routeBtn flex-col"></div> */}
      <Button className="routeBtn flex flex-col justify-center">
        <div>
          <QuestionCircleOutlined />
        </div>
        <div>路线一</div>
      </Button>
      <Button className="routeBtn flex flex-col justify-center">
        <div>
          <QuestionCircleOutlined />
        </div>
        <div>路线二</div>
      </Button>
    </FloatButton.Group>
  </>
);

export default RoutePicker;
