import JSZip from "jszip";
import FileSaver from "file-saver";
export const imageRes = { width: 2628, height: 2022 };
// TODO: finalize the sections
export const defaultSecStyle = {
  x: 0,
  y: 1750,
  fontSize: 60,
};
export const stemSections: {
  x: number;
  y: number;
  fontSize: number;
  section: string;
}[] = [
  { section: "12 - MARIE CURIE", ...defaultSecStyle },
  { section: "12 - CHARLES FLINT", ...defaultSecStyle },
  { section: "12 - ISAAC NEWTON", ...defaultSecStyle },
  { section: "12 - ALBERT EINSTEIN", ...defaultSecStyle },
  {
    section: "11 - DIOSDADO BANATAO",
    ...defaultSecStyle,
    x: -10,
    fontSize: 56,
  },
  { section: "11 - GREGORIO ZARA", ...defaultSecStyle },
  { section: "11 - FE DEL MUNDO", ...defaultSecStyle },
  { section: "11 - CASIMIRO DEL ROSARIO", ...defaultSecStyle },
  { section: "11 - EDUARDO QUISIMBING", ...defaultSecStyle },
  { section: "11 - CLARA LIM SYLIANCO", ...defaultSecStyle },
];
export const humssSections: {
  x: number;
  y: number;
  fontSize: number;
  section: string;
}[] = [
  { section: "12 - NICK JOAQUIN", ...defaultSecStyle },
  { section: "12 - JUAN NAKPIL", ...defaultSecStyle },
  { section: "12 - FERNANDO AMORSOLO", ...defaultSecStyle },
  { section: "11 - ANDRES BONIFACIO", ...defaultSecStyle },
  { section: "11 - JOSE RIZAL", ...defaultSecStyle },
  { section: "11 - APOLINARIO MABINI", ...defaultSecStyle, fontSize: 58 },
  { section: "11 - MELCHORA AQUINO", ...defaultSecStyle },
  { section: "11 - GABRIELA SILANG", ...defaultSecStyle },
];
// Create a function to zip and download blob images
// export async function zipAndDownloadImages(
//   blobImages: Blob[],
//   zipFileName: string
// ): Promise<void> {
//   try {
//     const zip = new JSZip();

//     // Add each blob image to the zip file
//     blobImages.forEach((blob, index) => {
//       // Generate a unique file name for each image (e.g., image1.png, image2.png, ...)
//       const fileName = `image${index + 1}.png`;
//       zip.file(fileName, blob);
//     });

//     // Generate the zip file
//     const zipBlob = await zip.generateAsync({ type: "blob" });

//     // Trigger the download
//     FileSaver.saveAs(zipBlob, zipFileName);
//   } catch (error) {
//     console.error("Error zipping and downloading images:", error);
//   }
// }
export async function zipAndDownloadImagesWithNames(
  imageObjects: { blob: Blob; name: string }[],
  zipFileName: string
): Promise<void> {
  try {
    const zip = new JSZip();

    // Add each blob image to the zip file with custom names
    imageObjects.forEach((imageObject, index) => {
      const fileName = `${imageObject.name}.png`;
      zip.file(fileName, imageObject.blob);
    });

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Trigger the download
    FileSaver.saveAs(zipBlob, zipFileName);
  } catch (error) {
    console.error("Error zipping and downloading images:", error);
  }
}

// Example usage
// const blobImage1 = new Blob([/* Image data as Uint8Array or ArrayBuffer */], { type: 'image/png' });
// const blobImage2 = new Blob([/* Image data as Uint8Array or ArrayBuffer */], { type: 'image/png' });

// const blobImages = [blobImage1, blobImage2];
// const zipFileName = 'images.zip';

// zipAndDownloadImages(blobImages, zipFileName);
export async function dataURItoBlob(dataURI: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Convert base64 to raw binary data held in a string
    const byteString = atob(dataURI.split(",")[1]);

    // Separate out the mime component
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // Write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);

    // Create a view into the buffer
    const ia = new Uint8Array(ab);

    // Set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Write the ArrayBuffer to a blob, and resolve the promise
    const blob = new Blob([ab], { type: mimeString });
    resolve(blob);
  });
}
