import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Divider,
  Grid,
  Header,
  Loader
} from 'semantic-ui-react'

import { createVideo, deleteVideo, getVideos, getVideosByUser, updateVideo } from '../api/videos-api'
import Auth from '../auth/Auth'
import { Video } from '../types/Video'

interface VideosProps {
  auth: Auth
  history: History
}

interface VideosState {
  videos: Video[]
  newVideoName: string
  loadingVideos: boolean
}

export class Videos extends React.Component {
    state: VideosState = {
        videos: [],
        newVideoName: '',
        loadingVideos: true
      }

render() {
    return (
        <div>
            <Header as="h1">Videos</Header>
            {this.renderVideos()}
        </div>
    )
}

handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  this.setState({ newTodoName: event.target.value })
}

async componentDidMount() {
  try {
    const videos = await getVideos()
    this.setState({
      videos,
      loadingVideos: false
    })
  } catch (e) {
    alert(`Failed to fetch videos: ${(e as Error).message}`)
  }
}

renderVideos() {
  if (this.state.loadingVideos) {
    return this.renderLoading()
  }

  return this.renderVideosList()
}

renderLoading() {
  return (
    <Grid.Row>
      <Loader indeterminate active inline="centered">
        Loading Videos
      </Loader>
    </Grid.Row>
  )
}

renderVideosList() {
  return (
    <Grid padded>
      {this.state.videos.map((video, pos) => {
        return (
          <Grid.Row 
            key={video.videoId}>
            <Grid.Column width={10} verticalAlign="middle">
            {video.attachmentUrl && (
              <video
                onClick={()=> this.playVideo(video.attachmentUrl)}
                id="video-player"
                width="200"
                height="100">
                <source src={video.attachmentUrl} id="mp4"></source>
              </video>
            )}
            </Grid.Column>

            <Grid.Column onClick={()=> this.playVideo(video.attachmentUrl)} width={6} floated="left" >
              <h3>{video.name}</h3>
              <p>{video.description}</p>
              {dateFormat(video.createdAt, 'yyyy-mm-dd')}
            </Grid.Column>

            <Grid.Column width={16}>
              <Divider />
            </Grid.Column>
          </Grid.Row>
        )
      })}
    </Grid>
  )
}

playVideo(attachmentUrl: string | undefined) {
  if(attachmentUrl)
  window.location.href = attachmentUrl
}

}