"use client";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import React, { ChangeEvent, useEffect, useState } from "react";
import { read, utils } from "xlsx";
import { useDataSheetStore } from "./store";

const DataImport = () => {
  const { dataSheet, setDataSheet } = useDataSheetStore();

  return (
    <div className="max-w-full">
      {dataSheet.length !== 0 && (
        <div className="max-w-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {dataSheet[0].map((val, idx) => {
                  return <TableHead key={idx}>{val}</TableHead>;
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSheet.map((val: any, idx: number) => {
                if (idx === 0) return;
                return (
                  <TableRow key={idx}>
                    {val.map((val: any, idx: number) => {
                      return <TableCell key={idx}>{val}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DataImport;
