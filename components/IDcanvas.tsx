"use client";

import URLImage from "@/app/UrlImage";
import { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { Stage, Layer, Text } from "react-konva";
import stemPhoto from "@/app/STEM.png";
import humssPhoto from "@/app/HUMSS.png";

import backImg from "@/app/BACK.png";
export default function IDCanvas(
  stageRef: any,
  stageSize: { width: number; height: number; scaleX: number; scaleY: number },
  lastNameStyle: { x: number; y: number; fontSize: number },
  nameStyle: { x: number; y: number; fontSize: number },
  setOr: ({
    indexValue,
    defaultValue,
    caps,
    customText,
  }: {
    indexValue?: number;
    defaultValue?: string;
    caps?: boolean;
    customText?: string;
  }) => string | undefined,
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
  birthDateText: string,
  birthDateIndex: number,
  lastName: string,
  firstName: string,
  middleName: string,
  lrn: string,
  suffix: string,
  guardian: string,
  contactNumber: string,
  address: string,

  photoImage: string,
  signatureImage: string,
  signatureImageStyle: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
  },
  setSignatureStyle: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
      width: number;
      height: number;
      scale: number;
    }>
  >,
  isStem: boolean
) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    console.log(e.key);
    e.preventDefault();
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
      case "+":
        setPhotoStyle((val) => {
          return { ...val, scale: val.scale + 0.05 };
        });
        break;
      case "-":
        setPhotoStyle((val) => {
          return { ...val, scale: val.scale - 0.05 };
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
          <URLImage src={backImg.src} x={1350}></URLImage>
        </Layer>
        <Layer>
          <Text
            y={lastNameStyle.y}
            x={lastNameStyle.x}
            fontSize={lastNameStyle.fontSize}
            text={`${setOr({
              indexValue: studentNameIndex.last,
              defaultValue: "STUDENT_NAME",
              caps: true,
              customText: lastName,
            })?.trim()},`}
            fill="#e2b808"
            shadowBlur={25}
            shadowOpacity={0.4}
            shadowEnabled
            shadowOffsetX={-2}
            shadowOffsetY={3}
            wrap="word"
            letterSpacing={3}
            width={850}
            fontFamily="Horizon"
          ></Text>

          <Text
            y={nameStyle.y}
            x={nameStyle.x}
            fontSize={nameStyle.fontSize}
            text={`${setOr({
              indexValue: studentNameIndex.first,
              defaultValue: "FIRST_NAME",
              customText: firstName,

              caps: true,
            })} ${setOr({
              indexValue: studentNameIndex.middle,
              defaultValue: "",
              customText: middleName,

              caps: true,
            })} ${setOr({
              indexValue: studentNameIndex.suffix,
              customText: suffix,

              defaultValue: "",
            })}`}
            fill="#fcffde"
            shadowBlur={25}
            shadowOpacity={0.5}
            shadowEnabled
            shadowOffsetX={-2}
            shadowOffsetY={3}
            letterSpacing={3}
            wrap="word"
            width={850}
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
            width={1275}
            fontFamily="Horizon"
          ></Text>
          <Text
            y={lrnStyle.y}
            x={lrnStyle.x}
            fontSize={lrnStyle.fontSize}
            text={`LRN: ${setOr({
              indexValue: lrnIndex,
              defaultValue: "LRN",
              customText: lrn,

              caps: true,
            })?.trim()}`}
            wrap="char"
            align="center"
            fill="#fcffde"
            letterSpacing={13}
            width={1275}
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
          <URLImage
            x={signatureImageStyle.x}
            y={signatureImageStyle.y}
            // width={signatureImageStyle.width}
            // height={signatureImageStyle.height}
            onDragEnd={(e) => {
              setSignatureStyle((val) => {
                return {
                  ...val,
                  x: e.currentTarget.x(),
                  y: e.currentTarget.y(),
                };
              });
              console.log(e.currentTarget.x());
            }}
            scaleX={signatureImageStyle.scale}
            scaleY={signatureImageStyle.scale}
            draggable
            src={signatureImage}
          ></URLImage>
          <Text
            y={guardianNameStyle.y}
            x={guardianNameStyle.x}
            fontSize={guardianNameStyle.fontSize}
            text={setOr({
              indexValue: guardianNameIndex,
              defaultValue: "GUARDIAN_NAME",
              customText: guardian,

              caps: true,
            })?.trim()}
            width={1000}
            align="center"
            fontFamily="Noto Serif"
          ></Text>
          <Text
            y={contactNumStyle.y}
            x={contactNumStyle.x}
            fontSize={contactNumStyle.fontSize}
            text={setOr({
              indexValue: contactNumberIndex,
              customText: contactNumber,

              defaultValue: "CONTACT_NUMBER",
            })}
            width={1000}
            align="center"
            fontFamily="Noto Serif"
          ></Text>
          <Text
            y={addressStyle.y}
            x={addressStyle.x}
            fontSize={addressStyle.fontSize}
            text={setOr({
              indexValue: addressIndex,
              customText: address,

              defaultValue: "ADDRESS",
            })}
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
          <Text
            y={1313}
            x={218}
            fontSize={45}
            text={setOr({
              indexValue: birthDateIndex,
              customText: birthDateText,
              defaultValue: "0000-00-00",
            })}
            width={300}
            align="center"
            fontStyle="bold"
            fontFamily="Noto Serif"
          ></Text>
        </Layer>
      </Stage>
    </div>
  );
}
