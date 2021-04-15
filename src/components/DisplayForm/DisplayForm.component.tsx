import React from 'react';
import { Container, Row, Form, Col, Button, Badge } from 'react-bootstrap';

interface DisplayFormProps {
  fileNames: string[];
  inputKey: string;
  onFileChange: (files: FileList | null) => void;
  onFileUpload: any;
}

const DisplayForm: React.FC<DisplayFormProps> = ({ fileNames, inputKey, onFileChange, onFileUpload }: DisplayFormProps) => {

  return (
    <Container>
      <Row>
        <Col xs={6}>
          <Form.File
            custom
            className="mr-sm-2"
            label={fileNames}
            multiple
            type="file"
            id="fileMainInput" 
            onChange={(e: { target: { files: FileList | null; }; }) => onFileChange(e.target.files)} 
            key={inputKey || ''}>
          </Form.File>
        </Col>
        {/* <Col xs={9}>
          {fileNames.map(fileName => <><Badge pill variant="success">{fileName}</Badge>{' '}</>)}
        </Col> */}
      </Row>
      <Row>
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