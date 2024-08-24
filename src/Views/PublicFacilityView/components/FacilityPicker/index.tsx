import React from "react";
import { QuestionCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, FloatButton } from "antd";

import "./index.less";

const FacilityPicker: React.FC = () => (
  <>
    {/* <FloatButton.Group shape="circle" style={{ right: 24 }}>
      <FloatButton icon={<QuestionCircleOutlined />} />
      <FloatButton />
      <FloatButton.BackTop visibilityHeight={0} />
    </FloatButton.Group> */}
    <FloatButton.Group
      shape="square"
      style={{ right: 40, bottom: 200 }}
      className="routeBtnGroup"
    >
      {/* <div className="routeBtn flex-col"></div> */}
      <Button className="routeBtn flex flex-col justify-center">
        <div>
          <QuestionCircleOutlined />
        </div>
        <div>公交站</div>
      </Button>
      <Button className="routeBtn flex flex-col justify-center">
        <div>
          <QuestionCircleOutlined />
        </div>
        <div>地铁站</div>
      </Button>
      <Button className="routeBtn flex flex-col justify-center">
        <div>
          <QuestionCircleOutlined />
        </div>
        <div>卫生间</div>
      </Button>
      <Button className="routeBtn flex flex-col justify-center">
        <div>
          <QuestionCircleOutlined />
        </div>
        <div>母婴室</div>
      </Button>
    </FloatButton.Group>
  </>
);

export default FacilityPicker;
