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
import {
  dataURItoBlob,
  defaultSecStyle,
  zipAndDownloadImagesWithNames,
} from "./utils";

import { useDataSheetStore, useIdValuesStore, useImageStore } from "./store";
import Konva from "konva";
import { useLeavePageConfirm } from "./signature/useLeavePageConfirm";

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
import chae from "./chae.png";
import defaultImage from "./defaultImage.png";
import signature from "./Signature.png";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { imageRes, stemSections, humssSections } from "./utils";
import CustomTextField from "@/components/CustomTextField";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
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
  useLeavePageConfirm();

  const [stageSize] = useState({
    width: imageRes.width * 0.3,
    height: imageRes.height * 0.3,
    scaleX: (imageRes.width * 0.3) / imageRes.width,
    scaleY: (imageRes.height * 0.3) / imageRes.height,
    // scaleX: 1,
    // scaleY: 1,
  });

  const [index, setIndex] = useState(1);
  const [photoImage, setPhotoImage] = useState(defaultImage.src);
  const [signatureImage, setSignatureImage] = useState("");
  const [tcSignatureImage, setTcSignatureImage] = useState("");

  const { dataSheet, baseSheet, setDataSheet, setBaseSheet } =
    useDataSheetStore();
  const {
    addressIndex,
    contactNumberIndex,
    guardianNameIndex,
    studentNameIndex,
    lrnIndex,
    birthDateIndex,
    sexIndex,

    setAddressIndex,
    setContactNumberIndex,
    setStudentFirstNameIndex,
    setStudentMiddleNameIndex,
    setStudentLastNameIndex,
    setStudentSuffixIndex,
    setGuardianNameIndex,
    setLrnIndex,
    setBirthDateIndex,
    setSexIndex,
  } = useIdValuesStore();
  const {
    idImages,
    profileImages,
    signatureImages,
    addIdImage,
    addProfileImages,
    addSignatureImages,
  } = useImageStore();

  const stageRef = useRef<Konva.Stage>(null);
  const [lastNameStyle, setLastNameStyle] = useState({
    x: 130,
    y: 500,
    fontSize: 110,
  });
  const [nameStyle, setNameStyle] = useState({
    x: 130,
    y: 612,
    fontSize: 90,
  });
  const [secStyle, setSecStyle] = useState(defaultSecStyle);
  const [rdStyle, setRdStyle] = useState({ x: 160, y: 1800, fontSize: 56 });
  const [lrnStyle, setLrnStyle] = useState({ x: 5, y: 1909, fontSize: 55 });

  const [photoStyle, setPhotoStyle] = useState({
    x: 712,
    y: 470,
    width: 1000,
    height: 1000,
    scale: 0.8,
  });
  const [signatureImageStyle, setSignatureImageStyle] = useState({
    x: 218,
    y: 1100,
    width: 1000,
    height: 1000,
    scale: 0.6,
  });
  const [tcSignatureImageStyle, setTcSignatureImageStyle] = useState({
    x: 1920,
    y: 1250,
    width: 1000,
    height: 1000,
    scale: 0.6,
  });
  const [guardianNameStyle, setGuardianNameStyle] = useState({
    x: 1490,
    y: 578,
    fontSize: 56,
  });
  const [contactNumStyle, setContactNumStyle] = useState({
    x: 1490,
    y: 815,
    fontSize: 56,
  });
  const [addressStyle, setAddressStyle] = useState({
    x: 1490,
    y: 1050,
    fontSize: 56,
  });
  const [adviserStyle, setAdviserStyle] = useState({
    x: 1490,
    y: 1310,
    fontSize: 56,
  });
  const [adviserText, setAdviserText] = useState("");
  const [secText, setSecText] = useState("");
  const [isStem, setIsStem] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMale, setIsMale] = useState(true);
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      // Check if the pressed key is one of the arrow keys (left, up, right, down)
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        // Prevent the default scrolling behavior
        e.preventDefault();
      }
    };

    // Add an event listener for keydown when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array to ensure the effect runs only once

  useEffect(() => {
    if (profileImages.length !== 0 && dataSheet.length !== 0) {
      const profileFromName = profileImages.filter((val) => {
        return val.name
          .split(".")[0]
          .toLocaleUpperCase()
          .toString()
          .trim()
          .includes(
            dataSheet[index][studentNameIndex.last ?? 0]
              .toString()
              .toLocaleUpperCase()
              .trim()
          );
      });
      if (profileFromName.length !== 0) {
        const imageUrl = URL.createObjectURL(profileFromName[0]);

        console.log(profileFromName[0]);
        setPhotoImage(imageUrl);
      }
    }
  }, [profileImages, index, studentNameIndex]);
  useEffect(() => {
    if (signatureImages.length !== 0 && dataSheet.length !== 0) {
      const signatureFromName = signatureImages.filter((val) => {
        return val.name
          .split(".")[0]
          .toLocaleUpperCase()
          .toString()
          .trim()
          .includes(
            dataSheet[index][studentNameIndex.last ?? 0]
              .toString()
              .toLocaleUpperCase()
              .trim()
          );
      });
      if (signatureFromName.length !== 0) {
        const imageUrl = URL.createObjectURL(signatureFromName[0]);

        console.log(signatureFromName[0]);
        setSignatureImage(imageUrl);
      }
    }
  }, [signatureImages, index, studentNameIndex]);
  useEffect(() => {
    if (baseSheet.length !== 0) {
      let gender = isMale ? "MALE" : "FEMALE";
      let abbreviation = isMale ? "M" : "F";

      setDataSheet(
        baseSheet.filter((val) => {
          return (
            (val[sexIndex] ?? "").toLocaleUpperCase() == gender ||
            (val[sexIndex] ?? "").toLocaleUpperCase() == abbreviation
          );
        })
      );
    }
  }, [isMale, baseSheet]);
  const generateImages = async () => {
    setIsGenerating(true);
    console.log(dataSheet);
    if (stageRef.current !== null && !isDone) {
      if (index === dataSheet.length - 1) {
        console.log("done");
        setIsDone(true);
      }

      console.log(isGenerating);
      // set size to full resolution
      stageRef.current.width(imageRes.width);
      stageRef.current.height(imageRes.height);

      stageRef.current.scaleX(1);
      stageRef.current.scaleY(1);

      const dataURL = stageRef.current.toDataURL({ pixelRatio: 1 });
      const blob = await dataURItoBlob(dataURL);
      addIdImage({
        blob,
        name:
          setOr({
            caps: true,
            customText: lastName,
            defaultValue: "ID Image",
            indexValue: studentNameIndex.last,
          }) ?? "ID IMAGE",
      });

      console.log(index, dataSheet.length);

      if (index < dataSheet.length - 1) {
        setIndex(index + 1);
      }
      // // reset to default size
      stageRef.current.width(stageSize.width);
      stageRef.current.height(stageSize.height);

      stageRef.current.scaleX(stageSize.scaleX);
      stageRef.current.scaleY(stageSize.scaleY);
      setIsGenerating(false);
    }
  };

  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    try {
      if (evt.target.files !== null && evt.target.files.length !== 0) {
        setIsCustomText(false);
        setIndex(0);
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
        setBaseSheet(raw_data as string[][]);
      }
    } catch (error) {
      console.log(error);
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
  const [isCustomText, setIsCustomText] = useState(false);

  const [lastName, setLastName] = useState("last_name");
  const [firstName, setFirstName] = useState("first_name");
  const [middleName, setMiddleName] = useState("middle_name");
  const [lrn, setLRN] = useState("lrn");
  const [suffix, setSuffix] = useState("");
  const [guardian, setGuardian] = useState("guardian");
  const [contactNumber, setContactNumber] = useState("contact_number");
  const [address, setAddress] = useState("address");
  const [birthDate, setBirthDate] = useState("2000-03-08");

  const setOr = ({
    indexValue,
    defaultValue,
    caps = false,
    customText,
  }: {
    indexValue?: number;
    defaultValue?: string;
    caps?: boolean;
    customText?: string;
  }) => {
    let result: string | undefined;
    if (dataSheet.length !== 0) {
      if (caps) {
        result = capitalizeWords(
          (dataSheet[index][indexValue ?? 0] ?? "").toString()
        );
      } else {
        result = dataSheet[index][indexValue ?? 0] ?? "";
      }
    } else if (isCustomText) {
      result = customText;
    } else {
      result = defaultValue;
    }
    return result;
  };
  const onImagesChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files !== null && event.target.files.length !== 0) {
      console.log(event.target.files);

      addProfileImages(Array.from(event.target.files));
    }
  };
  const onSignatureChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files !== null && event.target.files.length !== 0) {
      console.log(event.target.files);

      addSignatureImages(Array.from(event.target.files));
    }
  };
  return (
    <div>
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
              birthDate,
              birthDateIndex,
              lastName,
              firstName,
              middleName,
              lrn,
              suffix,
              guardian,
              contactNumber,
              address,
              photoImage,
              signatureImage,
              signatureImageStyle,
              setSignatureImageStyle,
              tcSignatureImage,
              tcSignatureImageStyle,
              setTcSignatureImageStyle,
              isStem
            )}
            <div className="flex flex-row gap-10 items-center">
              <h1>Student Pictures: </h1>
              <div>
                <Input
                  type="file"
                  name="images"
                  onChange={onImagesChange}
                  multiple
                  accept="image/*"
                ></Input>
              </div>
              <div className="justify-center items-center">
                <Button onClick={() => setIsCropOpen(true)}>Crop Image</Button>
              </div>
            </div>
            <div className="grid grid-cols-5 max-w-xl gap-2">
              {profileImages.map((val, idx) => {
                // console.log(val);
                const imageUrl = URL.createObjectURL(val);
                return (
                  <button
                    className="flex flex-col items-center gap-1 max-w-[125px] border-2"
                    onClick={() => {
                      console.log(idx);
                      setPhotoImage(imageUrl);
                    }}
                    key={idx}
                  >
                    <img src={imageUrl} alt="" />
                    <p className="text-center break-all text-sm">{val.name}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-row gap-10 items-center">
              <h1 className="text-sm ">Signature Pictures:</h1>
              <div>
                <Input
                  type="file"
                  name="images"
                  onChange={onSignatureChange}
                  multiple
                  accept="image/*"
                ></Input>
              </div>
              <div className="justify-center items-center">
                <Button
                  onClick={() => {
                    setSignatureImage("");
                    console.log("gell");
                  }}
                >
                  Remove Current Signature
                </Button>{" "}
              </div>
            </div>

            <div className="grid grid-cols-5 max-w-xl gap-2">
              {signatureImages.map((val, idx) => {
                // console.log(val);
                const imageUrl = URL.createObjectURL(val);
                return (
                  <button
                    className="flex flex-col items-center justify-center border-2 rounded-lg max-w-[100px]"
                    onClick={() => {
                      console.log(idx);
                      setSignatureImage(imageUrl);
                    }}
                    key={idx}
                  >
                    <img src={imageUrl} alt="" />
                    <p className="text-center break-all text-sm">{val.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-row">
            {/* <DataImport></DataImport> */}
            <div>
              {dataSheet.length !== 0 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="Inputs">
                    <AccordionTrigger>Set Inputs</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-1">
                        {SelectField(
                          "Last Name",
                          studentNameIndex.last,
                          setStudentLastNameIndex,
                          baseSheet
                        )}
                        {SelectField(
                          "First Name",
                          studentNameIndex.first,
                          setStudentFirstNameIndex,
                          baseSheet
                        )}
                        {SelectField(
                          "Middle Name",
                          studentNameIndex.middle,
                          setStudentMiddleNameIndex,
                          baseSheet
                        )}
                        {SelectField(
                          "Suffix",
                          studentNameIndex.suffix,
                          setStudentSuffixIndex,
                          baseSheet
                        )}
                        {SelectField(
                          "Guardian Name",
                          guardianNameIndex,
                          setGuardianNameIndex,
                          baseSheet
                        )}
                        {SelectField(
                          "Contact Number",
                          contactNumberIndex,
                          setContactNumberIndex,
                          baseSheet
                        )}
                        {SelectField(
                          "Address",
                          addressIndex,
                          setAddressIndex,
                          baseSheet
                        )}
                        {SelectField("LRN", lrnIndex, setLrnIndex, baseSheet)}
                        {SelectField(
                          "Birthdate",
                          birthDateIndex,
                          setBirthDateIndex,
                          baseSheet
                        )}
                        {SelectField("Sex", sexIndex, setSexIndex, baseSheet)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              {isCustomText && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="Inputs">
                    <AccordionTrigger>Set Inputs</AccordionTrigger>
                    <AccordionContent>
                      <div>
                        <CustomTextField
                          name="Last Name"
                          value={lastName}
                          setCustomText={setLastName}
                        />
                        <CustomTextField
                          name="First Name"
                          value={firstName}
                          setCustomText={setFirstName}
                        />
                        <CustomTextField
                          name="Middle Name"
                          value={middleName}
                          setCustomText={setMiddleName}
                        />
                        <CustomTextField
                          name="Suffix"
                          value={suffix}
                          setCustomText={setSuffix}
                        />
                        <CustomTextField
                          name="LRN"
                          value={lrn}
                          setCustomText={setLRN}
                        />
                        <CustomTextField
                          name="Birthdate"
                          value={birthDate}
                          setCustomText={setBirthDate}
                        />
                        <CustomTextField
                          name="Guardian"
                          value={guardian}
                          setCustomText={setGuardian}
                        />
                        <CustomTextField
                          name="Contact Number"
                          value={contactNumber}
                          setCustomText={setContactNumber}
                        />
                        <CustomTextField
                          name="Address"
                          value={address}
                          setCustomText={setAddress}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              <div>
                <Label>Spreadsheet:</Label>
                <Input
                  type="file"
                  name="data"
                  id="data"
                  onChange={onFileChange}
                  accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
                {baseSheet.length !== 0 || isCustomText ? (
                  <div>
                    <div className="flex flex-row justify-center gap-2 my-2">
                      <Button
                        onClick={async () => {
                          await generateImages();
                        }}
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
                          // await zipAndDownloadImages(idImages, "ID Images");
                          await zipAndDownloadImagesWithNames(
                            idImages,
                            "ID IMAGES"
                          );
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
                  <Dialog open={isCropOpen}>
                    <DialogTrigger asChild>
                      <div className="flex flex-col w-full items-center justify-center">
                        <h1>Image Scale:{photoStyle.scale.toFixed(2)}</h1>
                        <Slider
                          defaultValue={[photoStyle.scale]}
                          max={5}
                          onValueChange={(val) => {
                            setPhotoStyle((state) => ({
                              ...state,
                              scale: val[0],
                            }));
                          }}
                          step={0.01}
                        ></Slider>
                        <h1>
                          Signature Scale:{signatureImageStyle.scale.toFixed(2)}
                        </h1>
                        <Slider
                          defaultValue={[signatureImageStyle.scale]}
                          max={5}
                          onValueChange={(val) => {
                            setSignatureImageStyle((state) => ({
                              ...state,
                              scale: val[0],
                            }));
                          }}
                          step={0.01}
                        ></Slider>
                        <div className="flex flex-row gap-2">
                          <div className="w-20">
                            <h1 className="text-sm">Last name:</h1>
                            <Input
                              type="number"
                              min={12}
                              max={120}
                              value={lastNameStyle.fontSize}
                              onChange={(e) => {
                                setLastNameStyle((state) => ({
                                  ...state,
                                  fontSize: +e.target.value,
                                }));
                                console.log(e.target.value);
                              }}
                            ></Input>
                          </div>
                          <div className="w-20">
                            <h1 className="text-sm">Name: </h1>

                            <Input
                              type="number"
                              min={12}
                              max={120}
                              value={nameStyle.fontSize}
                              onChange={(e) => {
                                setNameStyle((state) => ({
                                  ...state,
                                  fontSize: +e.target.value,
                                }));
                                console.log(e.target.value);
                              }}
                            ></Input>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <Cropper
                        ref={cropperRef}
                        boundaryClassName="h-[500px]"
                        src={photoImage}
                      ></Cropper>
                      <Button onClick={() => onCrop()}>Crop</Button>
                      <DialogClose asChild>
                        <Button onClick={() => setIsCropOpen(false)}>
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  <div className="flex flex-row justify-center items-center my-1">
                    <div>
                      <Label>STEM?</Label>
                      <Checkbox
                        checked={isStem}
                        onCheckedChange={() => {
                          setIsStem((state) => !state);
                        }}
                      ></Checkbox>
                    </div>
                    {baseSheet.length === 0 && (
                      <div>
                        <Label>Use Custom Text</Label>
                        <Checkbox
                          checked={isCustomText}
                          onCheckedChange={() => {
                            setIsCustomText((state) => !state);
                          }}
                        ></Checkbox>
                      </div>
                    )}
                    {baseSheet.length !== 0 && (
                      <div>
                        <Label>Male</Label>
                        <Checkbox
                          checked={isMale}
                          onCheckedChange={() => {
                            setIsMale((state) => !state);
                          }}
                        ></Checkbox>
                      </div>
                    )}
                  </div>
                  <div className="my-1 flex flex-col gap-1">
                    <div className="flex flex-row items-center justify-between ">
                      <Label>Teacher's Signature:</Label>
                      <Input
                        type="number"
                        value={tcSignatureImageStyle.scale}
                        max={5}
                        step={0.1}
                        onChange={(e) => {
                          setTcSignatureImageStyle((state) => ({
                            ...state,
                            scale: +e.target.value,
                          }));
                        }}
                      ></Input>
                    </div>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length !== 0) {
                          const img = URL.createObjectURL(files[0]);

                          setTcSignatureImage(img);
                        }
                      }}
                    ></Input>
                    <Input
                      type="text"
                      placeholder="Adviser Name:"
                      onChange={(e) =>
                        setAdviserText(e.target.value.toLocaleUpperCase())
                      }
                    ></Input>

                    <Select
                      onValueChange={(value) => {
                        setSecText(
                          (isStem ? stemSections : humssSections)[+value]
                            .section
                        );
                        setSecStyle({
                          x: +(isStem ? stemSections : humssSections)[+value].x,
                          y: +(isStem ? stemSections : humssSections)[+value].y,
                          fontSize: +(isStem ? stemSections : humssSections)[
                            +value
                          ].fontSize,
                        });
                        console.log(secStyle);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Section"></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(isStem ? stemSections : humssSections).map(
                          (val, idx) => {
                            return (
                              <SelectItem value={idx.toString()} key={idx}>
                                {val.section}
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="editor">
                      <AccordionTrigger>Edit Positions</AccordionTrigger>
                      <AccordionContent>
                        <Accordion type="multiple">
                          <AccordionItem value="Photo">
                            <AccordionTrigger>
                              Photo: x: {photoStyle.x.toFixed(2)} y:{" "}
                              {photoStyle.y.toFixed(2)} scale:
                              {photoStyle.scale.toFixed(2)}
                            </AccordionTrigger>
                            <AccordionContent></AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="lastName">
                            <AccordionTrigger>
                              Last Name: x: {lastNameStyle.x} y:{" "}
                              {lastNameStyle.y} size: {lastNameStyle.fontSize}
                            </AccordionTrigger>
                            <AccordionContent>
                              {Sliders(lastNameStyle, setLastNameStyle)}
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="name">
                            <AccordionTrigger>
                              Name: x: {nameStyle.x} y: {nameStyle.y} size:{" "}
                              {nameStyle.fontSize}
                            </AccordionTrigger>
                            <AccordionContent>
                              {Sliders(nameStyle, setNameStyle)}
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="section">
                            <AccordionTrigger>
                              Section: x: {secStyle.x} y: {secStyle.y} size:{" "}
                              {secStyle.fontSize}
                            </AccordionTrigger>
                            <AccordionContent>
                              {Sliders(secStyle, setSecStyle)}
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="lrn">
                            <AccordionTrigger>
                              LRN: x: {lrnStyle.x} y: {lrnStyle.y} size:{" "}
                              {lrnStyle.fontSize}
                            </AccordionTrigger>
                            <AccordionContent>
                              {Sliders(lrnStyle, setLrnStyle)}
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="guardian">
                            <AccordionTrigger>
                              Guardian Name: x: {guardianNameStyle.x} y:{" "}
                              {guardianNameStyle.y}
                            </AccordionTrigger>
                            <AccordionContent>
                              {Sliders(guardianNameStyle, setGuardianNameStyle)}
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="contactNumber">
                            <AccordionTrigger>
                              Contact Number: x: {contactNumStyle.x} y:{" "}
                              {contactNumStyle.y}
                            </AccordionTrigger>
                            <AccordionContent>
                              {Sliders(contactNumStyle, setContactNumStyle)}
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="address">
                            <AccordionTrigger>
                              Address: x: {addressStyle.x} y: {addressStyle.y}
                            </AccordionTrigger>
                            <AccordionContent>
                              {Sliders(addressStyle, setAddressStyle)}
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="adviser">
                            <AccordionTrigger>
                              Adviser: x: {adviserStyle.x} y: {adviserStyle.y}
                            </AccordionTrigger>
                            <AccordionContent>
                              {Sliders(adviserStyle, setAdviserStyle)}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
      <footer className="text-center flex flex-col">
        Made by ICT Club{" "}
        <Link href={"/signature"} className="underline">
          go to signature page
        </Link>
        <Link
          href={"https://adrian-stuff.github.io/id-pdf-generator/"}
          className="underline"
        >
          go to printing page
        </Link>
      </footer>
    </div>
  );
}
