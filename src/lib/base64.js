export const getBase64 = async (src) => {
  try {
    const response = await fetch(src);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const base64 = dataUrl;
        resolve(base64);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    throw new Error(`Error fetching image: ${err.message}`);
  }
};