"use client";
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toBlob } from "html-to-image";
import { zipAndDownloadImages, dataURItoBlob } from "./utils";

import { useDataSheetStore, useIdValuesStore, useImageStore } from "./store";
import { Stage, Layer, Text } from "react-konva";
import Konva from "konva";
import URLImage from "./UrlImage";
import DataImport from "./DataImport";
import { read, utils } from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import IDCanvas from "@/components/IDcanvas";
import Sliders from "@/components/Sliders";
import SelectField from "@/components/SelectField";
import { CropperRef, Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import smirk from "./smirk.png";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { imageRes } from "./utils";
function capitalizeWords(input: string): string {
  // Split the input string into words
  const words = input.toLowerCase().split(" ");

  // Capitalize the first letter of each word
  const capitalizedWords = words.map((word) => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return "";
  });

  // Join the capitalized words back into a string
  const result = capitalizedWords.join(" ");

  return result;
}

export default function Home() {
  const [stageSize] = useState({
    width: imageRes.width * 0.3,
    height: imageRes.height * 0.3,
    scaleX: (imageRes.width * 0.3) / imageRes.width,
    scaleY: (imageRes.height * 0.3) / imageRes.height,
    // scaleX: 1,
    // scaleY: 1,
  });

  const [index, setIndex] = useState(1);
  const [photoImage, setPhotoImage] = useState(smirk.src);
  const { dataSheet, setDataSheet } = useDataSheetStore();
  const {
    addressIndex,
    contactNumberIndex,
    guardianNameIndex,
    studentNameIndex,
    lrnIndex,

    setAddressIndex,
    setContactNumberIndex,
    setStudentFirstNameIndex,
    setStudentMiddleNameIndex,
    setStudentLastNameIndex,
    setStudentSuffixIndex,
    setGuardianNameIndex,
    setLrnIndex,
  } = useIdValuesStore();
  const { idImages, profileImages, addIdImage, addProfileImages } =
    useImageStore();

  const stageRef = useRef<Konva.Stage>(null);
  const [lastNameStyle, setLastNameStyle] = useState({
    x: 130,
    y: 600,
    fontSize: 90,
  });
  const [nameStyle, setNameStyle] = useState({
    x: 130,
    y: 712,
    fontSize: 70,
  });
  const [secStyle, setSecStyle] = useState({ x: 216, y: 1708, fontSize: 60 });
  const [rdStyle, setRdStyle] = useState({ x: 160, y: 1800, fontSize: 56 });
  const [lrnStyle, setLrnStyle] = useState({ x: 375, y: 1867, fontSize: 56 });

  const [photoStyle, setPhotoStyle] = useState({
    x: 712,
    y: 470,
    width: 1000,
    height: 1000,
    scale: 1.5,
  });
  const [guardianNameStyle, setGuardianNameStyle] = useState({
    x: 1565,
    y: 569,
    fontSize: 56,
  });
  const [contactNumStyle, setContactNumStyle] = useState({
    x: 1660,
    y: 795,
    fontSize: 56,
  });
  const [addressStyle, setAddressStyle] = useState({
    x: 1660,
    y: 1033,
    fontSize: 56,
  });
  const [adviserStyle, setAdviserStyle] = useState({
    x: 1660,
    y: 1345,
    fontSize: 56,
  });
  const [adviserText, setAdviserText] = useState("");
  const [secText, setSecText] = useState("");
  const [isStem, setIsStem] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImages = () => {
    if (stageRef.current !== null && !isDone) {
      setIsGenerating(true);
      if (index + 1 === dataSheet.length) {
        console.log("done");
        setIsDone(true);
      }
      // set size to full resolution
      stageRef.current.width(imageRes.width);
      stageRef.current.height(imageRes.height);

      stageRef.current.scaleX(1);
      stageRef.current.scaleY(1);

      const dataURL = stageRef.current.toDataURL({ pixelRatio: 1 });
      const blob = dataURItoBlob(dataURL);
      addIdImage(blob);

      console.log(index, dataSheet.length);

      if (index < dataSheet.length - 1) {
        setIndex(index + 1);
      }
      // reset to default size
      stageRef.current.width(stageSize.width);
      stageRef.current.height(stageSize.height);

      stageRef.current.scaleX(stageSize.scaleX);
      stageRef.current.scaleY(stageSize.scaleY);
      setIsGenerating(false);
    }
  };
  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files !== null) {
      setIndex(1);
      setIsDone(false);
      console.log(evt.target.files[0]);
      const spreadsheet = read(await evt.target.files[0].arrayBuffer(), {
        type: "buffer",
      });
      const worksheet = spreadsheet.Sheets[spreadsheet.SheetNames[0]];
      const raw_data = utils
        .sheet_to_json(worksheet, { header: 1 })
        .filter((val: any) => val.length > 0);
      console.log(raw_data);
      setDataSheet(raw_data as string[][]);
    }
  };
  const cropperRef = useRef<CropperRef>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const onCrop = () => {
    if (cropperRef.current) {
      setPhotoImage(cropperRef.current.getCanvas()?.toDataURL() as string);
      setIsCropOpen(false);
    }
  };
  const setOr = (
    indexValue?: number,
    defaultValue?: string,
    caps: boolean = false
  ) =>
    dataSheet.length !== 0
      ? caps
        ? capitalizeWords((dataSheet[index][indexValue ?? 0] ?? "").toString())
        : dataSheet[index][indexValue ?? 0] ?? ""
      : defaultValue;
  const onImagesChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files !== null) {
      console.log(event.target.files);
      addProfileImages(Array.from(event.target.files));
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2 ml-2">
      <div className="flex flex-row gap-2">
        <div className="flex flex-col gap-2">
          {IDCanvas(
            stageRef,
            stageSize,
            lastNameStyle,
            nameStyle,
            setOr,
            studentNameIndex,
            secStyle,
            secText,
            rdStyle,
            photoStyle,
            setPhotoStyle,
            guardianNameStyle,
            guardianNameIndex,
            contactNumStyle,
            contactNumberIndex,
            addressStyle,
            addressIndex,
            adviserStyle,
            adviserText,
            lrnIndex,
            lrnStyle,
            photoImage,
            isStem
          )}
          <div className="grid grid-cols-5 max-w-xl gap-2">
            {profileImages.map((val, idx) => {
              const imageUrl = URL.createObjectURL(val);
              return (
                <button
                  className="flex flex-col items-center gap-1 max-w-[125px] "
                  onClick={() => {
                    console.log(idx);
                    setPhotoImage(imageUrl);
                  }}
                  key={idx}
                >
                  <img src={imageUrl} alt="" />
                  <p className="text-center break-all">{val.name}</p>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-row">
          {/* <DataImport></DataImport> */}
          <div>
            {dataSheet.length !== 0 && (
              <div>
                <div>
                  {SelectField(
                    "First Name",
                    setStudentFirstNameIndex,
                    dataSheet
                  )}
                  {SelectField(
                    "Middle Name",
                    setStudentMiddleNameIndex,
                    dataSheet
                  )}
                  {SelectField("Last Name", setStudentLastNameIndex, dataSheet)}
                  {SelectField("Suffix", setStudentSuffixIndex, dataSheet)}
                </div>

                {SelectField("Guardian Name", setGuardianNameIndex, dataSheet)}
                {SelectField(
                  "Contact Number",
                  setContactNumberIndex,
                  dataSheet
                )}

                {SelectField("Address", setAddressIndex, dataSheet)}
                {SelectField("LRN", setLrnIndex, dataSheet)}
              </div>
            )}
            <div>
              <Label>Student Pictures:</Label>
              <Input
                type="file"
                name="images"
                onChange={onImagesChange}
                multiple
                accept="image/*"
              ></Input>
              <div>
                <Dialog open={isCropOpen}>
                  <DialogTrigger asChild>
                    <div className="flex w-full items-center justify-center">
                      <Button
                        className="my-2 "
                        onClick={() => setIsCropOpen(true)}
                      >
                        Edit Image
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <Cropper ref={cropperRef} src={photoImage}></Cropper>
                    <Button onClick={() => onCrop()}>Crop</Button>
                    <DialogClose asChild>
                      <Button onClick={() => setIsCropOpen(false)}>
                        Cancel
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
              <Label>Spreadsheet:</Label>

              <Input
                type="file"
                name="data"
                id="data"
                onChange={onFileChange}
                accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
              {dataSheet.length !== 0 ? (
                <div>
                  <div className="flex flex-row justify-center gap-2 my-2">
                    <Button
                      onClick={generateImages}
                      disabled={isDone || isGenerating}
                    >
                      {isGenerating
                        ? "Generating"
                        : isDone
                        ? "Done"
                        : "Generate Next"}
                    </Button>
                    <Button
                      onClick={async () => {
                        await zipAndDownloadImages(idImages, "ID Images");
                      }}
                    >
                      Download
                    </Button>
                  </div>
                  <h1>
                    {idImages.length.toString()} out of{" "}
                    {dataSheet.length.toString()} generated
                  </h1>
                </div>
              ) : (
                <h1 className="my-2 text-center">
                  Select a Spreadsheet to start
                </h1>
              )}
              <div>
                <div className="flex flex-row justify-center items-center my-1">
                  <Label>STEM?</Label>
                  <Checkbox
                    checked={isStem}
                    onCheckedChange={() => {
                      setIsStem((state) => !state);
                    }}
                  ></Checkbox>
                </div>
                <div className="my-1 flex flex-col gap-1">
                  <Input
                    type="text"
                    placeholder="Adviser Name:"
                    onChange={(e) => setAdviserText(e.target.value)}
                  ></Input>
                  <Input
                    type="text"
                    placeholder="Section Name:"
                    onChange={(e) => setSecText(e.target.value)}
                  ></Input>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>
                    Photo: x: {photoStyle.x} y: {photoStyle.y} scale:{" "}
                    {photoStyle.scale}
                  </Label>
                  <Slider
                    defaultValue={[photoStyle.x]}
                    max={imageRes.height}
                    onValueChange={(val) => {
                      setPhotoStyle((state) => ({ ...state, x: val[0] }));
                    }}
                  ></Slider>
                  <Slider
                    defaultValue={[photoStyle.y]}
                    max={imageRes.height}
                    onValueChange={(val) => {
                      setPhotoStyle((state) => ({ ...state, y: val[0] }));
                    }}
                  ></Slider>
                  <Slider
                    defaultValue={[photoStyle.scale]}
                    max={5}
                    onValueChange={(val) => {
                      setPhotoStyle((state) => ({ ...state, scale: val[0] }));
                    }}
                    step={0.01}
                  ></Slider>
                </div>
                <div>
                  <Label>
                    Last Name: x: {lastNameStyle.x} y: {lastNameStyle.y} size:{" "}
                    {lastNameStyle.fontSize}
                  </Label>
                  {Sliders(lastNameStyle, setLastNameStyle)}
                </div>
                <div>
                  <Label>
                    Name: x: {nameStyle.x} y: {nameStyle.y} size:{" "}
                    {nameStyle.fontSize}
                  </Label>
                  {Sliders(nameStyle, setNameStyle)}
                </div>
                <div>
                  <Label>
                    Section: x: {secStyle.x} y: {secStyle.y}
                  </Label>

                  {Sliders(secStyle, setSecStyle)}
                </div>
                <div>
                  <Label>
                    Guardian Name: x: {guardianNameStyle.x} y:{" "}
                    {guardianNameStyle.y}
                  </Label>

                  {Sliders(guardianNameStyle, setGuardianNameStyle)}
                </div>
                <div>
                  <Label>
                    Contact Number: x: {contactNumStyle.x} y:{" "}
                    {contactNumStyle.y}
                  </Label>

                  {Sliders(contactNumStyle, setContactNumStyle)}
                </div>
                <div>
                  <Label>
                    Address: x: {addressStyle.x} y: {addressStyle.y}
                  </Label>

                  {Sliders(addressStyle, setAddressStyle)}
                </div>
                <div>
                  <Label>
                    Adviser: x: {adviserStyle.x} y: {adviserStyle.y}
                  </Label>

                  {Sliders(adviserStyle, setAdviserStyle)}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="grid grid-flow-col ">
          {idImages.map((val) => {
            const imageUrl = URL.createObjectURL(val);
            return <img src={imageUrl} alt="" />;
          })}
        </div> */}
      </div>
    </div>
  );
}
