import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateVideoRequest } from '../../requests/CreateVideoRequest'
import { getUserId } from '../utils';
import { createVideo } from '../../bussinessLogic/videos'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const newVideo: CreateVideoRequest = JSON.parse(event.body)
  
      const userId = getUserId(event)
      const item = await createVideo(newVideo, userId)
  
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          item
        })
      }
    }
  )
  
  handler.use(
    cors({
      credentials: true
    })
  )
  