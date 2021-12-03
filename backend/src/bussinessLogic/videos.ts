import { VideosAccess } from "../dataLayer/videosAccess"
import { VideoItem } from "../models/VideoItem"
import { CreateVideoRequest } from "../requests/CreateVideoRequest"
import * as uuid from 'uuid'
import { UpdateVideoRequest } from "../requests/UpdateVideoRequest"

const bucketName = process.env.ATTACHMENT_S3_BUCKET

const videoAccess = new VideosAccess()

export async function createVideo(
  createVideoRequest: CreateVideoRequest,
  userId: string): Promise<VideoItem> {

    const videoId = uuid.v4()
    const createdAt = new Date().toISOString()


    return await videoAccess.createVideo({
        userId: userId,
        videoId: videoId,
        createdAt: createdAt,
        ...createVideoRequest,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${videoId}`
    })
}

export async function updateVideo(userId: string, videoId: string, updatedVideo: UpdateVideoRequest) {
    
  return await videoAccess.updateVideo(userId, videoId, updatedVideo)
}

export async function deleteVideo(videoId: string, userId: string): Promise<string> {
  
  return await videoAccess.deleteVideo(userId, videoId)
}

export async function getVideos(): Promise<VideoItem[]> {
  return await videoAccess.getVideos()
}

export async function getVideosByUser(userId: string): Promise<VideoItem[]> {
  return await videoAccess.getVideosByUser(userId)
}

export async function createAttachmentPresignedUrl(videoId: string) {
  return await videoAccess.createAttachmentPresignedUrl(videoId)
}