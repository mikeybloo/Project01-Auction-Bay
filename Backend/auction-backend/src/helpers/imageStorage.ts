import fs from 'fs'
import { diskStorage, Options } from 'multer'
import { extname } from 'path'

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'

const validFileExtensions: validFileExtensionsType[] = ['png', 'jpg', 'jpeg']
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg']

export const saveImageToStorage: Options = {
    storage: diskStorage({
      destination: './files',
      filename(req, file, callback) {
        // Create unique suffix
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        // Get file extention
        const ext = extname(file.originalname)
        // Write filename
        const filename = `${uniqueSuffix}${ext}`
  
        callback(null, filename)
      },
    }),
    fileFilter(req, file, callback) {
      const allowedMimeTypes: validMimeType[] = validMimeTypes
      allowedMimeTypes.includes(file.mimetype as validMimeType) ? callback(null, true) : callback(null, false)
    },
  }
  
  export const isFileExtensionSafe = async (fullFilePath: string): Promise<boolean> => {
    const { fileTypeFromFile } = await import('file-type');

    const fileExtensionAndMimeType = await fileTypeFromFile(fullFilePath);
    if (!fileExtensionAndMimeType?.ext) return false;

    const isFileTypeLegit = validFileExtensions.includes(fileExtensionAndMimeType.ext as validFileExtensionsType);
    const isMimeTypeLegit = validMimeTypes.includes(fileExtensionAndMimeType.mime as validMimeType);
    return isFileTypeLegit && isMimeTypeLegit;
  }
  
  export const removeFile = (fullFilePath: string): void => {
    try {
      fs.unlinkSync(fullFilePath)
    } catch (error) {
      console.log(error)
    }
  }