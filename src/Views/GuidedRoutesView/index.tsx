import { observer } from "mobx-react";
import * as echarts from "echarts";
import { Button } from "antd";
import { useStore } from "../../store";
import TripNodeList from "./components/TripNodeList";
import RoutePicker from "./components/RoutePicker";

import "./index.less";

const GuidedRoutesView = observer(() => {
  const rootStore = useStore();
  const { count } = rootStore;

  return (
    <div>
      {/* <Title text="游线导览" /> */}
      {/* <div>
        <div>
          <Button onClick={() => count.subtractCount()}>subtractCount</Button>
        </div>
        <div>计数:{count.count}</div>
      </div> */}
      <div className="guideBox">
        <RoutePicker />
        <div className="chart tripNodes">
          <TripNodeList />
        </div>
      </div>
    </div>
  );
});

export default GuidedRoutesView;
