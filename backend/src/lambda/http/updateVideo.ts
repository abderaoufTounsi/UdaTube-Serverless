import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { UpdateVideoRequest } from '../../requests/UpdateVideoRequest'
import { getUserId } from '../utils';
import { updateVideo } from '../../bussinessLogic/videos'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
      try{
      const updatedVideo: UpdateVideoRequest = JSON.parse(event.body)
      const videoId = event.pathParameters.videoId        
      const userId = getUserId(event)
      
      const newItem = await updateVideo(userId, videoId, updatedVideo)
  
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          newItem
        })
      }
    } catch(error) {
        return {
            statusCode: 500,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
              error
            })
          }
    }
    }
  )
  
  handler.use(
    cors({
      credentials: true
    })
  )
  