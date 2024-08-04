/**
 * @file This file contains the logic to extract the image metadata from the glob import
 */
const images: Record<string, () => Promise<{ default: ImageMetadata }>> =
  import.meta.glob<{ default: ImageMetadata }>('../pages/posts/*/*.{jpg,png}', {
    import: 'default',
  })

/**
 * Extracts the image metadata from the glob import
 * @param file - The file path to extract the image metadata from
 * @returns A function that returns a promise of the image metadata
 * @example extractPostImageFromGlob("2021-08-01-foo-bar")
 */
function blogSlugToLegendImageData(
  slug: string,
): Promise<{ default: ImageMetadata }> {
  const imageGlobMeta = Object.entries(images).find(([key]) => {
    if (key.includes(slug)) {
      return true
    }

    return false
  })

  return imageGlobMeta?.[1]?.()
}

export default blogSlugToLegendImageData
