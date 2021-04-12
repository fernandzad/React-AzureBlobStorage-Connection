import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col, Container,Alert } from 'react-bootstrap';

interface FormData {
  title: string;
	description: string;
  type: string;
  status: string;
};

const MetadataForm: React.FC = () => {
	const { handleSubmit, register } = useForm<FormData>();
	const [isSent, setIsSent] = useState<boolean>(false);

	const onSubmit = (data: FormData) => {
		const sendMetadataAsync = async () => {

			setIsSent(true);
			setTimeout(() => {
        setIsSent(false);
      }, 3000);

			const metadata = {
				status: 'in progress',
				data: {
					type: data.type,
					title: data.title,
					description: data.description,
					status: data.status
				}
			}

			const rawResponse = await fetch('http://localhost:7071/api/UpdateJobTrigger', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(metadata)
			});
		}
		sendMetadataAsync();
  };

  return (
		<Container className="pt-5">
			<Row>
				<Col>
					<Form>
						<Form.Group>
							<Form.Label>Title</Form.Label>
							<Form.Control 
								type="text" 
								placeholder="Enter a title"
								id="title"
								name="title"
								ref={register}/>
							<Form.Text className="text-muted">
								Please enter the title of the asset.
							</Form.Text>
						</Form.Group>

						<Form.Group>
							<Form.Label>Description</Form.Label>
							<Form.Control 
								type="text" 
								placeholder="Enter a description"
								id="description"
								name="description"
								ref={register}/>
							<Form.Text className="text-muted">
								Please enter the description of the asset.
							</Form.Text>
						</Form.Group>

						<Form.Group>
							<Form.Label>Type</Form.Label>
							<Form.Control 
								id="type"
								name="stype"
								as="select"
								ref={register} >
								<option value="Image">Image</option>
								<option value="Video">Video</option>
							</Form.Control>
							<Form.Text className="text-muted">
								Please select the type of the asset.
							</Form.Text>
						</Form.Group>

						<Form.Group>
							<Form.Label>Status</Form.Label>
							<Form.Control 
								id="status"
								name="status"
								as="select"
								ref={register} >
								<option value="NotPublished">Not Published</option>
								<option value="Published">Published</option>
							</Form.Control>
							<Form.Text className="text-muted">
								Please select the status of the asset.
							</Form.Text>
						</Form.Group>

						<Button 
							variant="primary"
							type="submit"
							onClick={handleSubmit(onSubmit)}>
							Save
						</Button>
						{isSent && <Alert variant="success">Metadata has been sent</Alert>}
					</Form>
				</Col>
			</Row>
		</Container>
  );
};

export default MetadataForm;