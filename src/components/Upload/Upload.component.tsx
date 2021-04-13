import React, { useState, useEffect } from 'react';

import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';

import uploadFileToBlob, { isStorageConfigured } from '../../services/azure-storage-blob';
import { getSasToken } from '../../services/SasTokenGenerator';
import { AssetList } from '../AssetList';

const App: React.FC = () => {
  // all blobs in container
  const [blobList, setBlobList] = useState<string[]>([]);
  const [sasToken, setSasToken] = useState<string>('');
  // current file to upload into container
  const [filesSelected, setFilesSelected] = useState<FileList | null>(null);
  const [fileName, setFileName] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  // UI/form management
  const [storageConfigured, setStorageConfigured] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  useEffect(() => {
    const retrieveSasToken = async () => {
      const token = await getSasToken();
      setSasToken(token);
      setStorageConfigured(isStorageConfigured(token));
    }

    retrieveSasToken();
  }, []);

  const onFileChange = (files: FileList | null) => {
    // capture file into state
    let fileNames:string[] = [];
    if (files != null) {
      setFilesSelected(files);
      for (let index = 0; index < files.length; index++) {
        fileNames.push(`${files[index].name} `);
      }
      setFileName(fileNames);

      setIsDraft(true);

      const setFileAsDraftCosmosDB = async () => {
        const metadata = {
          status: 'draft'
        }
        const rawResponse = await fetch(process.env.REACT_APP_DRAFT_ENDPOINT || '', {
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
    setUploading(true);

    const blobsInContainer: string[] = [];
    for (let index = 0; index < filesSelected!.length; index++) {
      let response: string[] = await uploadFileToBlob(filesSelected![index], sasToken);
      blobsInContainer.push(response[0]);
    }

    setUploading(false);
    // prepare UI for results
    setBlobList(blobsInContainer);

    // reset state/form
    setFilesSelected(null);
    setInputKey(Math.random().toString(36));
  };

  // display form
  const DisplayForm = () => (
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

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Upload Asset to Wonderland</h1>
          <br/>
          {isDraft && <Alert variant="success">Draft!</Alert>}
          <br />
          {storageConfigured && !uploading && <DisplayForm />}
          {storageConfigured && uploading && <Alert variant="warning">Uploading...</Alert>}
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


