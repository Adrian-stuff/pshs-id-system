"use client";
import { Button } from "@/components/ui/button";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  dataURItoBlob,
  downloadImage,
  zipAndDownloadImagesWithNames,
} from "../utils";
import SelectField from "@/components/SelectField";
import { useSignatureStore } from "../store";
import { read, utils } from "xlsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/router";
import { useLeavePageConfirm } from "./useLeavePageConfirm";

const Signature = () => {
  useLeavePageConfirm();

  const signatureRef = useRef<SignatureCanvas>(null);
  const { signatureImages, addSignatureImage } = useSignatureStore();
  const [index, setIndex] = useState(0);
  const [isMale, setIsMale] = useState(true);
  const [imageText, setImageText] = useState("ID Signature");

  const [screenSize, setScreenSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
  const [sheet, setSheet] = useState<string[][]>([]);
  const [baseSheet, setBaseSheet] = useState<string[][]>([]);
  const [lastNameIndex, setLastNameIndex] = useState(0);
  const [firstNameIndex, setFirstNameIndex] = useState(1);

  const [sexIndex, setSexIndex] = useState(8);
  const done = async () => {
    console.log("done");
    if (signatureRef.current !== null) {
      const blob = await dataURItoBlob(
        signatureRef.current.getTrimmedCanvas().toDataURL()
      );
      addSignatureImage({
        blob,
        name:
          sheet.length !== 0
            ? `${sheet[index][lastNameIndex]
                .trim()
                .toLocaleUpperCase()}, ${sheet[index][firstNameIndex]
                .trim()
                .toLocaleUpperCase()}`
            : "Signature",
      });
      if (index < sheet.length - 1) {
        setIndex((state) => state + 1);
      }

      // signatureRef.current.clear();
    }
  };
  const doneImage = async () => {
    if (signatureRef.current !== null) {
      const blob = await dataURItoBlob(
        signatureRef.current.getTrimmedCanvas().toDataURL()
      );
      downloadImage(blob, imageText);
      clear();
    }
  };
  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files !== null) {
      setIndex(0);
      console.log(evt.target.files[0]);
      const spreadsheet = read(await evt.target.files[0].arrayBuffer(), {
        type: "buffer",
      });
      const worksheet = spreadsheet.Sheets[spreadsheet.SheetNames[0]];
      const raw_data = utils
        .sheet_to_json(worksheet, { header: 1 })
        .filter((val: any) => val.length > 0);
      console.log(raw_data);
      setSheet(raw_data as string[][]);
      setBaseSheet(raw_data as string[][]);
    }
  };
  const clear = () => {
    console.log("clear");
    if (signatureRef.current !== null) {
      signatureRef.current.clear();
    }
  };
  const download = async () => {
    console.log("downloading");
    if (signatureRef.current !== null) {
      await zipAndDownloadImagesWithNames(signatureImages, "SIGNATURES");
    }
  };

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    console.log(screenSize);
    updateDimension();
    window.addEventListener("resize", updateDimension);
    // window.addEventListener("keydown", (e) => {
    //   // if (e.key == " ") {
    //   //   e.preventDefault();
    //   //   console.log("space");
    //   //   clear();
    //   // }

    //   console.log(e.key);
    // });
    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, []);
  useEffect(() => {
    clear();
  }, [signatureImages]);
  useEffect(() => {
    if (baseSheet.length !== 0) {
      setSheet(
        baseSheet.filter(
          (val) =>
            (val[sexIndex] ?? "").toLocaleUpperCase() ==
            (isMale ? "MALE" : "FEMALE")
        )
      );
    }
  }, [isMale, baseSheet]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <h1 className="font-bold text-3xl">Signature</h1>
        <Button className="" onClick={download}>
          Download all
        </Button>
      </div>
      <h1 className="font-bold text-2xl">
        {sheet.length !== 0 ? sheet[index][lastNameIndex] : "Enter Spreadsheet"}
      </h1>
      <div className="flex flex-row w-sm items-center">
        <Label>File Name: </Label>
        <Input
          type="text"
          value={imageText}
          placeholder="Student Last Name"
          onChange={(e) => setImageText(e.target.value.toLocaleUpperCase())}
        ></Input>
      </div>
      <Accordion className="mt-[-20px] pb-[-15px]" type="single" collapsible>
        <AccordionItem value="Open">
          <AccordionTrigger>Open Input</AccordionTrigger>

          <AccordionContent>
            {sheet.length !== 0 && (
              <div>
                {SelectField(
                  "Last Name",
                  lastNameIndex,
                  setLastNameIndex,
                  baseSheet
                )}
                {SelectField(
                  "First Name",
                  firstNameIndex,
                  setFirstNameIndex,
                  baseSheet
                )}
                {SelectField("Sex", sexIndex, setSexIndex, baseSheet)}
              </div>
            )}
            {sheet.length !== 0 && (
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
            <div className="flex flex-row gap-2">
              <Input
                type="file"
                name="data"
                id="data"
                onChange={onFileChange}
                accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {screenSize.width !== undefined ? (
        <div className="flex items-center">
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            minWidth={1.5}
            canvasProps={{
              width: screenSize.width - 10,
              height: 300,
              className: "sigCanvas bg-transparent border border-black",
            }}
          ></SignatureCanvas>
        </div>
      ) : (
        <h1>Loading</h1>
      )}
      <div className="flex justify-center items-center flex-row gap-2 mt-5 h-10">
        <Button className="" onClick={doneImage}>
          Download Image
        </Button>

        <Button onClick={clear}>Clear</Button>
        <Button onClick={done}>Done</Button>
      </div>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {signatureImages.map((val, idx) => {
          const imageUrl = URL.createObjectURL(val.blob);

          return (
            <div
              className="flex flex-col items-center justify-center border-2 rounded-lg"
              key={idx}
            >
              <img className="max-w-[100px]" src={imageUrl} alt="" />
              <h1>{val.name}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Signature;
