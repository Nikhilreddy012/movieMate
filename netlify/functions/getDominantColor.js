// netlify/functions/getDominantColor.js
const Vibrant = require('node-vibrant');


exports.handler = async function(event) {
  const { imageUrl } = event.queryStringParameters;

  if (!imageUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'imageUrl is required' }),
    };
  }

  try {
    // Fetch the image data and extract the dominant color
    const vibrant = new Vibrant(imageUrl);
    const colorPalette = await vibrant.getPalette(); // Extracts palette
    const dominantColor = colorPalette.DarkVibrant || colorPalette.Muted; // You can also check other color keys
    const hexColor = dominantColor.getHex()

    return {
      statusCode: 200,
      body: JSON.stringify({ hexColor }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to extract dominant color', error: error.message }),
    };
  }
};
