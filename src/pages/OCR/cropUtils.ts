export const getCroppedImg = (
  imageSrc: string,
  crop: any,
  zoom: number,
  rotation: number,
  greyscale: boolean,
  contrast: number
): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // Prevents CORS issues
    image.src = imageSrc;

    image.onload = () => {
      if (!crop || crop.width <= 0 || crop.height <= 0) {
        reject("Invalid crop dimensions");
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject("Canvas context not available");
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const croppedWidth = crop.width * scaleX;
      const croppedHeight = crop.height * scaleY;

      // Set canvas size to match crop size
      canvas.width = croppedWidth;
      canvas.height = croppedHeight;

      // Move to center and rotate
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Apply filters
      ctx.filter = `${greyscale ? "grayscale(100%)" : ""} contrast(${contrast}%)`;

      // Draw cropped image
      ctx.drawImage(
        image,
        crop.x * scaleX, // Source X
        crop.y * scaleY, // Source Y
        croppedWidth, // Source Width
        croppedHeight, // Source Height
        0,
        0,
        canvas.width,
        canvas.height
      );

      resolve(canvas);
    };

    image.onerror = () => reject("Failed to load image");
  });
};
