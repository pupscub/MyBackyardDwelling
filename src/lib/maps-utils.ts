/**
 * Utility functions for Google Maps integration
 */

/**
 * Creates a formatted address from individual components
 * 
 * @param street Street address
 * @param city City name
 * @param state State code
 * @param zipCode Zip/postal code
 * @returns Formatted address string
 */
export function formatAddress(
  street: string,
  city: string,
  state: string,
  zipCode: string
): string {
  return `${street}, ${city}, ${state} ${zipCode}`;
}

/**
 * Generates a Google Maps Static API URL for a satellite image of the given address
 * 
 * @param address The property address to generate a satellite image for
 * @param width The width of the image (default: 800)
 * @param height The height of the image (default: 400)
 * @param zoom The zoom level (default: 18)
 * @returns A URL to a Google Maps satellite image
 */
export function generateSatelliteImageUrl(
  address: string,
  width: number = 800,
  height: number = 400,
  zoom: number = 18
): string {
  // Get the API key from environment variables
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // If no API key is provided, return a placeholder
  if (!apiKey || apiKey === 'your-google-maps-api-key') {
    return `https://via.placeholder.com/${width}x${height}?text=Satellite+Image+Unavailable`;
  }
  
  // Encode the address for the URL
  const encodedAddress = encodeURIComponent(address);
  
  // Generate the Google Maps Static API URL
  return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=${zoom}&size=${width}x${height}&maptype=satellite&key=${apiKey}`;
}

/**
 * Alternative version that takes address components
 */
export function generateSatelliteImageUrlFromComponents(
  street: string,
  city: string,
  state: string,
  zipCode: string,
  width: number = 800,
  height: number = 400,
  zoom: number = 18
): string {
  const formattedAddress = formatAddress(street, city, state, zipCode);
  return generateSatelliteImageUrl(formattedAddress, width, height, zoom);
}

/**
 * Generates a Google Maps URL for a given address
 * 
 * @param address The property address to link to
 * @returns A URL to Google Maps for the given address
 */
export function generateGoogleMapsUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}

/**
 * Alternative version that takes address components
 */
export function generateGoogleMapsUrlFromComponents(
  street: string,
  city: string,
  state: string,
  zipCode: string
): string {
  const formattedAddress = formatAddress(street, city, state, zipCode);
  return generateGoogleMapsUrl(formattedAddress);
} 