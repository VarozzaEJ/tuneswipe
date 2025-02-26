import fileUpload from "express-fileupload";
import BaseController from "../utils/BaseController.js";
import { Auth0Provider } from "@bcwdev/auth0provider";
import { imageUploadService } from "../services/ImageUploadService.js";


export class ImageUploadController extends BaseController {
    constructor() {
        super('/api/uploadImage')
        this.router
            .use(Auth0Provider.getAuthorizedUserInfo)
            .use(fileUpload())
            .post('', this.uploadImage)
            .post('/sharp', this.uploadImageWithSharp)
            .delete('/:userId/:fileName', this.deleteImage)
    }

    async deleteImage(request, response, next) {
        try {
            const userId = request.userInfo.id
            const fileName = request.params.fileName
            const s3UserId = request.params.userId
            const deletedImage = await imageUploadService.deleteImage(fileName, userId, s3UserId)
            response.send(deletedImage)
        } catch (error) {
            next(error)
        }
    }

    async uploadImageWithSharp(request, response, next) {
        try {
            const file = request.files.image
            const userId = request.userInfo.id
            const uploadedImage = await imageUploadService.uploadImageWithSharp(file, userId)
            response.send(uploadedImage)
        } catch (error) {
            next(error)
        }
    }

    async uploadImage(request, response, next) {
        try {
            console.log(request.files.image)
            const userId = request.userInfo.id
            // const uploadedImage = await imageUploadService.uploadImage(request.files.image, userId)
            // response.send(uploadedImage)
        } catch (error) {
            next(error)
        }
    }
}