import React from "react";
import { Slider } from "antd";

interface SelectBoardProps {
  animationList: string[];
  onSelectAnimation: (animationName: string) => void;
  handleLightAngleChange: (value: number) => void;
}

const SelectBoard: React.FC<SelectBoardProps> = ({
  animationList,
  onSelectAnimation,
  handleLightAngleChange,
}) => {
  const handleAnimationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedAnimation = event.target.value;
    onSelectAnimation(selectedAnimation);
  };

  // const sliderOnChange = (value: number | number[]) => {
  //   console.log("sliderOnChange: ", value);
  // };

  const sliderOnAfterChange = (value: number | number[]) => {
    console.log("sliderOnAfterChange: ", value);
  };

  return (
    <div
      id="board"
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        width: "150px",
        height: "200px",
        backgroundColor: "gray",
      }}
    >
      <div id="animationBox">
        <label htmlFor="animationSelect">飞机动画切换:</label>
        <select id="animationSelect" onChange={handleAnimationChange}>
          {/* <option value="">选择动画：</option> */}
          {animationList.map((animation) => (
            <option key={animation} value={animation}>
              {animation}
            </option>
          ))}
        </select>
      </div>

      <div id="shadowBox">
        <label htmlFor="sliderChange">太阳光方向:</label>
        <Slider
          defaultValue={30}
          onChange={(value) => handleLightAngleChange(Number(value))}
          min={0}
          max={180}
          onAfterChange={sliderOnAfterChange}
        />
      </div>
    </div>
  );
};

export default SelectBoard;
