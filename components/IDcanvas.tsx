"use client";

import URLImage from "@/app/UrlImage";
import { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { Stage, Layer, Text } from "react-konva";
import stemPhoto from "@/app/1.png";
import humssPhoto from "@/app/2.png";

import backImg from "@/app/3.png";
export default function IDCanvas(
  stageRef: any,
  stageSize: { width: number; height: number; scaleX: number; scaleY: number },
  lastNameStyle: { x: number; y: number; fontSize: number },
  nameStyle: { x: number; y: number; fontSize: number },
  setOr: (
    indexValue?: number,
    defaultValue?: string,
    caps?: boolean
  ) => string | undefined,
  studentNameIndex: {
    first?: number | undefined;
    middle?: number | undefined;
    last?: number | undefined;
    suffix?: number | undefined;
  },
  secStyle: { x: number; y: number; fontSize: number },
  secText: string,
  rdStyle: { x: number; y: number; fontSize: number },
  photoStyle: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
  },
  setPhotoStyle: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
      width: number;
      height: number;
      scale: number;
    }>
  >,
  guardianNameStyle: { x: number; y: number; fontSize: number },
  guardianNameIndex: number,
  contactNumStyle: { x: number; y: number; fontSize: number },
  contactNumberIndex: number,
  addressStyle: { x: number; y: number; fontSize: number },
  addressIndex: number,
  adviserStyle: { x: number; y: number; fontSize: number },
  adviserText: string,
  lrnIndex: number,
  lrnStyle: { x: number; y: number; fontSize: number },

  photoImage: string,
  isStem: boolean
) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    console.log(e.key);
    switch (e.key) {
      case "ArrowUp":
        setPhotoStyle((val) => {
          return { ...val, y: val.y - 1 };
        });
        break;
      case "ArrowDown":
        setPhotoStyle((val) => {
          return { ...val, y: val.y + 1 };
        });
        break;
      case "ArrowLeft":
        setPhotoStyle((val) => {
          return { ...val, x: val.x - 1 };
        });
        break;
      case "ArrowRight":
        setPhotoStyle((val) => {
          return { ...val, x: val.x + 1 };
        });
        break;
      default:
        break;
    }
  };
  return (
    <div className="" tabIndex={1} onKeyDown={(e) => handleKeyDown(e)}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={stageSize.scaleX}
        scaleY={stageSize.scaleY}
      >
        <Layer>
          <URLImage src={isStem ? stemPhoto.src : humssPhoto.src}></URLImage>
          <URLImage src={backImg.src} x={1450}></URLImage>
        </Layer>
        <Layer>
          <Text
            y={lastNameStyle.y}
            x={lastNameStyle.x}
            fontSize={lastNameStyle.fontSize}
            text={`${setOr(
              studentNameIndex.last,
              "STUDENT_NAME",
              true
            )?.trim()},`}
            fill="#e2b808"
            shadowBlur={25}
            shadowOpacity={0.4}
            shadowEnabled
            shadowOffsetX={-2}
            shadowOffsetY={3}
            wrap="word"
            letterSpacing={3}
            width={900}
            fontFamily="Horizon"
          ></Text>

          <Text
            y={nameStyle.y}
            x={nameStyle.x}
            fontSize={nameStyle.fontSize}
            text={`${setOr(studentNameIndex.first, "FIRST_NAME", true)} ${setOr(
              studentNameIndex.middle,
              "",
              true
            )} ${setOr(studentNameIndex.suffix, "")}`}
            fill="#fcffde"
            shadowBlur={25}
            shadowOpacity={0.5}
            shadowEnabled
            shadowOffsetX={-2}
            shadowOffsetY={3}
            letterSpacing={3}
            wrap="word"
            width={900}
            fontFamily="Horizon"
          ></Text>
          <Text
            y={secStyle.y}
            x={secStyle.x}
            fontSize={secStyle.fontSize}
            text={secText.trim().length !== 0 ? secText : "SECTION"}
            wrap="word"
            align="center"
            // fill="#e2b808"
            letterSpacing={15}
            fill="#031b17"
            // shadowBlur={20}
            // shadowOpacity={0.3}
            // shadowEnabled
            // shadowOffsetX={-4}
            // shadowOffsetY={4}
            width={1414}
            fontFamily="Horizon"
          ></Text>
          <Text
            y={lrnStyle.y}
            x={lrnStyle.x}
            fontSize={lrnStyle.fontSize}
            text={`LRN: ${setOr(lrnIndex, "LRN", true)?.trim()}`}
            wrap="char"
            align="center"
            fill="#fcffde"
            letterSpacing={13}
            width={1414}
            fontFamily="Noto Serif"
          ></Text>
          <URLImage
            x={photoStyle.x}
            y={photoStyle.y}
            // width={photoStyle.width}
            // height={photoStyle.height}
            onDragEnd={(e) => {
              setPhotoStyle((val) => {
                return {
                  ...val,
                  x: e.currentTarget.x(),
                  y: e.currentTarget.y(),
                };
              });
              console.log(e.currentTarget.x());
            }}
            scaleX={photoStyle.scale}
            scaleY={photoStyle.scale}
            draggable
            src={photoImage}
          ></URLImage>
          <Text
            y={guardianNameStyle.y}
            x={guardianNameStyle.x}
            fontSize={guardianNameStyle.fontSize}
            text={setOr(guardianNameIndex, "GUARDIAN_NAME", true)?.trim()}
            width={1200}
            align="center"
            fontFamily="Noto Serif"
          ></Text>
          <Text
            y={contactNumStyle.y}
            x={contactNumStyle.x}
            fontSize={contactNumStyle.fontSize}
            text={setOr(contactNumberIndex, "CONTACT_NUMBER")}
            width={1000}
            align="center"
            fontFamily="Noto Serif"
          ></Text>
          <Text
            y={addressStyle.y}
            x={addressStyle.x}
            fontSize={addressStyle.fontSize}
            text={setOr(addressIndex, "ADDRESS")}
            width={1000}
            align="center"
            fontFamily="Noto Serif"
          ></Text>
          <Text
            y={adviserStyle.y}
            x={adviserStyle.x}
            fontSize={adviserStyle.fontSize}
            text={adviserText.trim().length !== 0 ? adviserText : "ADVISER"}
            width={1000}
            align="center"
            fontStyle="bold"
            fontFamily="Noto Serif"
          ></Text>
        </Layer>
      </Stage>
    </div>
  );
}
