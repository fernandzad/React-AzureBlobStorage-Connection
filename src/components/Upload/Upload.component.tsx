import React, { useState } from 'react';

import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';

import uploadFileToBlob, { isStorageConfigured } from '../../services/azure-storage-blob';
import { AssetList } from '../AssetList';

const storageConfigured = isStorageConfigured();

const App: React.FC = () => {
  // all blobs in container
  const [blobList, setBlobList] = useState<string[]>([]);
  // current file to upload into container
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('Please, select a file...');
  const [isDraft, setIsDraft] = useState<boolean>(false);
  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const onFileChange = (files: FileList | null) => {
    // capture file into state
    if (files != null) {
      setFileSelected(files[0]);
      setFileName(files[0].name);

      setIsDraft(true);

      const setFileAsDraftCosmosDB = async () => {
        const metadata = {
          status: 'draft'
        }
        const rawResponse = await fetch('http://localhost:7071/api/DraftJobTrigger', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metadata)
        });
        const content = await rawResponse.json();
      };
      setFileAsDraftCosmosDB();
      
      setTimeout(() => {
        setIsDraft(false);
      }, 3000);
    }
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    const blobsInContainer: string[] = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    setBlobList(blobsInContainer);

    // reset state/form
    setFileSelected(null);
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  // display form
  const DisplayForm = () => (
    <Container>
      <Row>
        <Col>
          <Form.File 
            custom 
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

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Upload Asset to Wonderland</h1>
          <br/>
          {isDraft && <Alert variant="success">Draft!</Alert>}
          <br />
          {storageConfigured && !uploading && <DisplayForm />}
          {storageConfigured && uploading && <Alert variant="warning">Uploading</Alert>}
        </Col>
      </Row>
      <Row>
        <Col>
          {storageConfigured && blobList.length > 0 && <AssetList blobList={blobList}/> }
          {!storageConfigured && <div>Storage is not configured.</div>}
        </Col>
      </Row>
      <hr />
    </Container>
  );
};

export default App;


