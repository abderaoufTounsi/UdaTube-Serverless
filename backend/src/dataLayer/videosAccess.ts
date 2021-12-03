import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { VideoItem } from '../models/VideoItem'
import { UpdateVideoRequest } from '../requests/UpdateVideoRequest'

// const XAWS = AWSXRay.captureAWS(AWS)

// const s3 = new XAWS.S3({
//     signatureVersion: 'v4'
// })

export class VideosAccess {
    
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly videosTable = process.env.VIDEOS_TABLE,
        // private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        // private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
        // private readonly videosCreatedAtIndex = process.env.VIDEOS_CREATED_AT_INDEX
    ) {}

    async createVideo(videoItem: VideoItem): Promise<VideoItem> {
        await this.docClient.put({
            TableName: this.videosTable,
            Item: videoItem
        }).promise()

        return videoItem
    }

    async updateVideo(userId: string, videoId: string, updatedVideo: UpdateVideoRequest) {
        await this.docClient.update({
            TableName: this.videosTable,
            Key: {
                userId: userId,
                videoId: videoId
            },
            ExpressionAttributeNames: {"#N": "name"},
            UpdateExpression: 'set #N = :name, description = :description',
            ExpressionAttributeValues: {
                ':name': updatedVideo.name,
                ':description': updatedVideo.description
            }
        }).promise()

        return {
            userId: userId,
            videoId: videoId,
            ... updatedVideo
        }
    }

    async deleteVideo(userId: string, videoId: string): Promise<string> {

        await this.docClient.delete({
            TableName: this.videosTable,
            Key: {
                userId: userId,
                videoId: videoId
            }
        }).promise()
        
        return JSON.stringify ({
            userId: userId,
            videoId: videoId
        })
    }

    async getVideos(): Promise<VideoItem[]> {

        const result = await this.docClient.scan({
            TableName: this.videosTable,
        }).promise()
        
        const items = result.Items
        return items as VideoItem[]
    }
}