import React, { useState } from 'react';

import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';

import uploadFileToBlob, { isStorageConfigured } from '../../services/azure-storage-blob';
import { AssetList } from '../AssetList';

const storageConfigured = isStorageConfigured();

const App: React.FC = () => {
  // all blobs in container
  const [blobList, setBlobList] = useState<string[]>([]);
  // current file to upload into container
  const [filesSelected, setFilesSelected] = useState<FileList | null>(null);
  const [fileName, setFileName] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const onFileChange = (files: FileList | null) => {
    // capture file into state
    let fileNames:string[] = [];
    if (files != null) {
      setFilesSelected(files);
      for (let index = 0; index < files.length; index++) {
        fileNames.push(files[index].name)
      }
      setFileName(fileNames);

      //setIsDraft(true);

      // const setFileAsDraftCosmosDB = async () => {
      //   const metadata = {
      //     status: 'draft'
      //   }
      //   const rawResponse = await fetch('http://localhost:7071/api/DraftJobTrigger', {
      //     method: 'POST',
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(metadata)
      //   });
      //   const content = await rawResponse.json();
      // };
      //setFileAsDraftCosmosDB();
      
      setTimeout(() => {
        setIsDraft(false);
      }, 3000);
    }
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // let promises : Promise<string>[] = [];
    
    // *** UPLOAD TO AZURE STORAGE ***
    const blobsInContainer: string[] = [];
    for (let index = 0; index < filesSelected!.length; index++) {
      // let newPromise: Promise<string> = new Promise((resolve, reject) => {
      //   console.log("RESOLVE", { resolve });
      //   console.log("REJECT", { reject });
      //   uploadFileToBlob(filesSelected![index]);
      // });
      // promises.push(newPromise);
      let r: string[] = await uploadFileToBlob(filesSelected![index]);
      blobsInContainer.push(r[0]);
    }

    // const returned: string[] = await Promise.all(promises);
    // console.log("RETURNED VALUES", returned);

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


