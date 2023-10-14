import { create } from "zustand";

interface IdImageState {
  idImages: Blob[];
  profileImages: File[];
  addIdImage: (idImage: Blob) => void;
  addProfileImages: (image: File[]) => void;
}

interface DataSheetState {
  dataSheet: string[][];
  setDataSheet: (dataSheet: string[][]) => void;
}

interface IdValuesState {
  studentNameIndex: {
    first?: number;
    middle?: number;
    last?: number;
    suffix?: number;
  };
  guardianNameIndex: number;
  contactNumberIndex: number;
  addressIndex: number;
  lrnIndex: number;
  setStudentFirstNameIndex: (index: number) => void;
  setStudentMiddleNameIndex: (index: number) => void;
  setStudentLastNameIndex: (index: number) => void;
  setStudentSuffixIndex: (index: number) => void;

  setGuardianNameIndex: (index: number) => void;
  setContactNumberIndex: (index: number) => void;
  setAddressIndex: (index: number) => void;
  setLrnIndex: (index: number) => void;
}

export const useImageStore = create<IdImageState>((set) => ({
  idImages: [],
  profileImages: [],
  addIdImage: (idImage) =>
    set((state) => ({ idImages: [...state.idImages, idImage] })),
  addProfileImages: (image) => set((state) => ({ profileImages: image })),
}));

export const useDataSheetStore = create<DataSheetState>((set) => ({
  dataSheet: [],
  setDataSheet: (dataSheet) => set((state) => ({ dataSheet: dataSheet })),
}));

export const useIdValuesStore = create<IdValuesState>((set) => ({
  studentNameIndex: { first: 0, middle: 0, last: 0, suffix: 0 },
  guardianNameIndex: 0,
  contactNumberIndex: 0,
  addressIndex: 0,
  lrnIndex: 0,

  setStudentFirstNameIndex: (index: number) =>
    set((state) => ({
      studentNameIndex: {
        first: index,
        middle: state.studentNameIndex.middle,
        last: state.studentNameIndex.last,
        suffix: state.studentNameIndex.suffix,
      },
    })),
  setStudentMiddleNameIndex: (index: number) =>
    set((state) => ({
      studentNameIndex: {
        first: state.studentNameIndex.first,
        middle: index,
        last: state.studentNameIndex.last,
        suffix: state.studentNameIndex.suffix,
      },
    })),
  setStudentLastNameIndex: (index: number) =>
    set((state) => ({
      studentNameIndex: {
        first: state.studentNameIndex.first,
        middle: state.studentNameIndex.middle,
        last: index,
        suffix: state.studentNameIndex.suffix,
      },
    })),
  setStudentSuffixIndex: (index: number) =>
    set((state) => ({
      studentNameIndex: {
        first: state.studentNameIndex.first,
        middle: state.studentNameIndex.middle,
        last: state.studentNameIndex.last,
        suffix: index,
      },
    })),
  setGuardianNameIndex: (index: number) =>
    set((state) => ({ guardianNameIndex: index })),
  setContactNumberIndex: (index: number) =>
    set((state) => ({ contactNumberIndex: index })),
  setAddressIndex: (index: number) => set((state) => ({ addressIndex: index })),
  setLrnIndex: (index: number) => set((state) => ({ lrnIndex: index })),
}));
