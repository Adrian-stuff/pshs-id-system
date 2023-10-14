import { imageRes } from "@/app/utils";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

export default function Sliders(
  style: {
    x: number;
    y: number;
    fontSize: number;
  },
  setStyle: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
      fontSize: number;
    }>
  >
) {
  return (
    <div className="flex flex-row  gap-2">
      <div className=" grid grid-flow-row w-full">
        <Slider
          defaultValue={[style.x]}
          max={imageRes.height}
          onValueChange={(val) => {
            setStyle((state) => ({ ...state, x: val[0] }));
          }}
        ></Slider>
        <Slider
          defaultValue={[style.y]}
          max={imageRes.height}
          onValueChange={(val) => {
            setStyle((state) => ({ ...state, y: val[0] }));
          }}
        ></Slider>
      </div>

      <div className="w-20">
        <Input
          type="number"
          min={12}
          max={120}
          defaultValue={style.fontSize}
          onChange={(e) => {
            setStyle((state) => ({ ...state, fontSize: +e.target.value }));
            console.log(e.target.value);
          }}
        ></Input>
      </div>
    </div>
  );
}
