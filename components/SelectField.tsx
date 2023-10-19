"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SelectField(
  name: string,
  index: number | undefined,
  setIndex: (index: number) => void,
  dataSheet: string[][]
) {
  return (
    <Select
      // defaultValue={dataSheet[0][index ?? 0].toString()}
      onValueChange={(val) => {
        setIndex(+val);
        console.log(+val);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={`Select field for ${name}`}></SelectValue>
      </SelectTrigger>
      <SelectContent>
        {dataSheet[0].map((val, idx) => {
          return (
            <SelectItem value={idx.toString()} key={idx}>
              {val} {idx.toString()}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
