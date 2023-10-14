import JSZip from "jszip";
import FileSaver from "file-saver";
export const imageRes = { width: 2848, height: 2000 };

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
export function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}
