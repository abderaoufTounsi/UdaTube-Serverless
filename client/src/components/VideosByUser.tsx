import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createVideo, deleteVideo, getUploadUrl, getVideos, getVideosByUser, updateVideo, uploadFile } from '../api/videos-api'
import Auth from '../auth/Auth'
import { Video } from '../types/Video'

interface VideosProps {
  auth: Auth
  history: History
}

interface VideosState {
  videos: Video[]
  newVideoName: string
  newVideoDescription: string
  file: any
  loadingVideos: boolean
}

export class VideosByUser extends React.PureComponent<VideosProps, VideosState> {
    state: VideosState = {
        videos: [],
        newVideoName: '',
        newVideoDescription: '',
        file: undefined,
        loadingVideos: true
      }

render() {
    return (
        <div>
            <Header as="h1">My Videos</Header>

            {this.renderCreateVideoInput()}

            {this.renderVideos()}
        </div>
    )
}

handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  this.setState({ newVideoName: event.target.value })
}

handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  this.setState({ newVideoDescription: event.target.value })
}

handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files
  if (!files) return

  this.setState({
    file: files[0]
  })
}

onEditButtonClick = (videoId: string) => {
  this.props.history.push(`/videos/${videoId}/edit`)
}

onVideoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
  const name = this.state.newVideoName
  const description = this.state.newVideoDescription
  const file = this.state.file

  if (name && file) {
    try {
      const newVideo = await createVideo(this.props.auth.getIdToken(), {
        name: name,
        description: description
      })

      this.setState({
        videos: [...this.state.videos, newVideo],
        newVideoName: ''
      })

      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(),newVideo.videoId)
      await uploadFile(uploadUrl, file)
      alert('Video created successfully!')

    } catch {
      alert('Video creation failed')
    }
  
  } else {
     alert('Name of video and video file are required')
  }

  
}

onVideoDelete = async (videoId: string) => {
  try {
    await deleteVideo(this.props.auth.getIdToken(), videoId)
    this.setState({
      videos: this.state.videos.filter(video => video.videoId !== videoId)
    })
  } catch {
    alert('Video deletion failed')
  }
}


async componentDidMount() {
  try {
    const videos = await getVideosByUser(this.props.auth.getIdToken())
    this.setState({
      videos,
      loadingVideos: false
    })
  } catch (e) {
    alert(`Failed to fetch videos: ${(e as Error).message}`)
  }
}

renderCreateVideoInput() {
  return (
    <Grid.Row>
      <Grid.Column width={16}>
        <Input
          action={{
            color: 'teal',
            require: true,
            labelPosition: 'left',
            icon: 'add',
            content: 'New video',
            onClick: this.onVideoCreate
          }}
          fluid
          actionPosition="left"
          placeholder="Name"
          onChange={this.handleNameChange}
        />
        <br/>
        <Input
          fluid
          placeholder="Description"
          onChange={this.handleDescriptionChange}
        />
        <br/>
        <input
          type="file"
          accept="video/*"
          placeholder="Upload video"
          onChange={this.handleFileChange}
        />

      </Grid.Column>
      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>
    </Grid.Row>
  )
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

            <Grid.Column
                onClick={()=> this.playVideo(video.attachmentUrl)}
                width={6}
                floated="left" >
              <h3>{video.name}</h3>
              <p>{video.description}</p>
              {dateFormat(video.createdAt, 'yyyy-mm-dd')}
            </Grid.Column>

            <Grid.Column width={2} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(video.videoId)}
                >
                  <Icon name="pencil" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => this.onVideoDelete(video.videoId)}
                >
                  <Icon name="delete" />
                </Button>
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
