import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Alert, ProgressBar } from 'react-bootstrap';

import uploadFileToBlob, { isStorageConfigured } from '../../services/azure-storage-blob';
import { getSasToken } from '../../services/SasTokenGenerator';
import { Response } from '../../services/types/SasTokenGenerator.types';

import { DisplayForm } from '../DisplayForm';
import { AssetList } from '../AssetList';

const SASTOKEN = "SASTOKEN";

const Upload: React.FC = () => {
  // all blobs in container
  const [blobList, setBlobList] = useState<string[]>([]);
  // current file to upload into container
  const [filesSelected, setFilesSelected] = useState<FileList | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  // UI/form management
  const [storageConfigured, setStorageConfigured] = useState<boolean>(false);

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const retrieveSasToken = async () => {
      const response: Response = await getSasToken();
      localStorage.setItem(SASTOKEN, response.Token);

      setStorageConfigured(isStorageConfigured(response.Token));
    }

    retrieveSasToken();
  }, []);

  const onFileChange = (files: FileList | null) => {
    setProgress(0);
    let names: string[] = [];
    if (files != null) {
      setFilesSelected(files);
      for (let index = 0; index < files.length; index++) {
        names.push(`${files[index].name} `);
      }
      setFileNames(names);

      setIsDraft(true);

      const setFileAsDraftCosmosDB = async () => {
        const metadata = {
          status: 'draft'
        }
        await fetch(process.env.REACT_APP_DRAFT_ENDPOINT || '', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metadata)
        });
      };
      setFileAsDraftCosmosDB();
      
      setTimeout(() => {
        setIsDraft(false);
      }, 3000);
    }
  };

  const onFileUpload = async () => {

    let promises : Promise<string>[] = [];
    const blobsInContainer: string[] = [];

    const sasToken: string | null = localStorage.getItem(SASTOKEN);
    if(filesSelected !== null)
    {
      for (let index = 0; index < filesSelected!.length; index++) {
        let newPromise: Promise<string> = new Promise((resolve, reject) => {
          resolve('Correctly resolved');
          uploadFileToBlob(filesSelected![index], sasToken, setProgress);
        });
        promises.push(newPromise); 
      }
      await Promise.allSettled(promises);
    }
    setBlobList(blobsInContainer);
    setFilesSelected(null);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Upload Asset to MAM</h1>
          <br/>
          {isDraft && <Alert variant="success">The Files were successfully Drafted</Alert>} 
          <br/>
          {storageConfigured && <DisplayForm fileNames={fileNames}
            onFileChange={onFileChange} onFileUpload={onFileUpload} />}
        </Col>
      </Row>
      <Row>
        <Col>
          <br/>
          {(progress !== 100 && progress !== 0) && <ProgressBar animated now={progress} label={`${progress}%`} />}
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

export default Upload;


