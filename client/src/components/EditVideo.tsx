import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { updateVideo } from '../api/videos-api'
import { UpdateVideoRequest } from '../types/UpdateVideoRequest'


interface EditVideoProps {
  match: {
    params: {
      videoId: string
    }
  }
  auth: Auth
}

interface EditVideoState {
  updateVideoName: string
  updateVideoDescription: string
}

export class EditVideo extends React.PureComponent<
  EditVideoProps,
  EditVideoState
> {
  state: EditVideoState = {
    updateVideoName: '',
    updateVideoDescription: ''
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ updateVideoName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ updateVideoDescription: event.target.value })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.updateVideoName) {
        alert('Name is required')
        return
      }

      const updateRequest: UpdateVideoRequest = {
        name: this.state.updateVideoName,
        description: this.state.updateVideoDescription
      }

      const updatedVideo = await updateVideo(this.props.auth.getIdToken(), this.props.match.params.videoId, updateRequest)

      alert('Video was updated!')
    } catch (e) {
      alert((e as Error).message)
    }
  }


  render() {
    return (
      <div>
        <h1>Update video</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input
              type="text"
              placeholder="Name"
              onChange={this.handleNameChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              type="text"
              placeholder="Description"
              onChange={this.handleDescriptionChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        <Button
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
