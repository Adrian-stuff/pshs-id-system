"use client";
import { Button } from "@/components/ui/button";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { dataURItoBlob, zipAndDownloadImagesWithNames } from "../utils";
import SelectField from "@/components/SelectField";

import { useSignatureStore } from "../store";
import { read, utils } from "xlsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
const Signature = () => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const { signatureImages, addSignatureImage } = useSignatureStore();
  const [index, setIndex] = useState(1);
  const [isMale, setIsMale] = useState(true);
  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [sheet, setSheet] = useState<string[][]>([]);
  const [baseSheet, setBaseSheet] = useState<string[][]>([]);

  const [lastNameIndex, setLastNameIndex] = useState(1);
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
            ? sheet[index][lastNameIndex].trim().toLocaleUpperCase()
            : "Signature",
      });
      setIndex((state) => state + 1);
      // signatureRef.current.clear();
    }
  };
  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files !== null) {
      setIndex(1);
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
  useEffect(() => {
    clear();
  }, [signatureImages]);
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
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="font-bold text-3xl">Signature</h1>
      <h1 className="font-bold text-2xl">
        {sheet.length !== 0 ? sheet[index][lastNameIndex] : "Enter Spreadsheet"}
      </h1>
      {sheet.length !== 0 && (
        <div>
          {SelectField("Last Name", lastNameIndex, setLastNameIndex, sheet)}
          {SelectField("Sex", sexIndex, setSexIndex, sheet)}
        </div>
      )}
      {sheet.length !== 0 && (
        <div>
          <Label>Male</Label>
          <Checkbox
            checked={isMale}
            onCheckedChange={() => {
              setIsMale((state) => !state);
              setSheet(
                baseSheet.filter(
                  (val) =>
                    val[sexIndex].toLocaleUpperCase() ==
                    (!isMale ? "MALE" : "FEMALE")
                )
              );
            }}
          ></Checkbox>
        </div>
      )}
      <Input
        type="file"
        name="data"
        id="data"
        onChange={onFileChange}
        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />

      <div className="flex items-center">
        <SignatureCanvas
          ref={signatureRef}
          penColor="black"
          canvasProps={{
            width: screenSize.width - 50,
            height: 500,
            className: "sigCanvas bg-transparent border border-black",
          }}
        ></SignatureCanvas>
      </div>
      <div className="flex flex-row gap-2">
        <Button onClick={done}>Done</Button>
        <Button onClick={clear}>Clear</Button>
        <Button onClick={download}>Download all Signatures</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
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
