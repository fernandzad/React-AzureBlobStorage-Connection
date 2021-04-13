import React, { MouseEventHandler } from 'react';
import { Container, Row, Form, Col, Button } from 'react-bootstrap';

type functionFileUpload = MouseEventHandler<HTMLElement> | ((file: File) => void);

interface DisplayFormProps {
  fileName: string[];
  inputKey: string;
  onFileChange: (files: FileList | null) => void;
  onFileUpload: any;
}

const DisplayForm: React.FC<DisplayFormProps> = ({ fileName, inputKey, onFileChange, onFileUpload }: DisplayFormProps) => {
  return (
    <Container>
      <Row>
        <Col>
          <Form.File 
            custom 
            multiple
            type="file" 
            label={fileName} 
            id="fileMainInput" 
            onChange={(e: { target: { files: FileList | null; }; }) => onFileChange(e.target.files)} 
            key={inputKey || ''}>
          </Form.File>
        </Col>
      </Row>
      <Row>
        <Col>
          <br/>
          <Button variant="success" type="submit" onClick={onFileUpload}>Upload</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default DisplayForm;