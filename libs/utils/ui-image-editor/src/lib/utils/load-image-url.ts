const regexDataUrl =
  /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i;

function isDataURL(str: string) {
  return !!str.match(regexDataUrl);
}

export function loadImageURL(imageURL: string, crossOrigin?: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    if (!isDataURL(imageURL) && crossOrigin) {
      image.crossOrigin = crossOrigin;
    }
    image.src = imageURL;
  });
}
