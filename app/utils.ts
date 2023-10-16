import JSZip from "jszip";
import FileSaver from "file-saver";
export const imageRes = { width: 2848, height: 2000 };
// TODO: finalize the sections
export const stemSections = [
  { section: "12 - MARIE CURIE", fontSize: 60 },
  { section: "12 - CHARLES FLINT", fontSize: 60 },
  { section: "12 - ISAAC NEWTON", fontSize: 60 },
  { section: "12 - ALBERT EINSTEIN", fontSize: 60 },
  { section: "11 - DIOSDADO BANATAO", fontSize: 60 },
  { section: "11 - GREGORIO ZARA", fontSize: 60 },
  { section: "11 - FE DEL MUNDO", fontSize: 60 },
  { section: "11 - CASIMIRO DEL ROSARIO", fontSize: 60 },
  { section: "11 - EDUARDO QUISIMBING", fontSize: 60 },
  { section: "11 - CLARA LIM-SYLIANCO", fontSize: 60 },
];
export const humssSections = [
  { section: "12 - NICK JOAQUIN", fontSize: 60 },
  { section: "12 - JUAN NAKPIL", fontSize: 60 },
  { section: "12 - FERNANDO AMORSOLO", fontSize: 60 },
  { section: "11 - ANDRES BONIFACIO", fontSize: 60 },
  { section: "11 - JOSE RIZAL", fontSize: 60 },
  { section: "11 - APOLINARIO MABINI", fontSize: 60 },
  { section: "11 - AQUINO", fontSize: 60 },
  { section: "11 - GABRIELA SILANG", fontSize: 60 },
];
// Create a function to zip and download blob images
export async function zipAndDownloadImages(
  blobImages: Blob[],
  zipFileName: string
): Promise<void> {
  try {
    const zip = new JSZip();

    // Add each blob image to the zip file
    blobImages.forEach((blob, index) => {
      // Generate a unique file name for each image (e.g., image1.png, image2.png, ...)
      const fileName = `image${index + 1}.png`;
      zip.file(fileName, blob);
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
