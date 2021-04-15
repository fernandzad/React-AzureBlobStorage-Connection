import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Alert, ProgressBar } from 'react-bootstrap';

import uploadFileToBlob, { isStorageConfigured } from '../../services/azure-storage-blob';
import { getSasToken } from '../../services/SasTokenGenerator';
import { Response } from '../../services/types/SasTokenGenerator.types';

import { DisplayForm } from '../DisplayForm';
import { AssetList } from '../AssetList';

const Upload: React.FC = () => {
  // all blobs in container
  const [blobList, setBlobList] = useState<string[]>([]);
  const [sasToken, setSasToken] = useState<string>('');
  // current file to upload into container
  const [filesSelected, setFilesSelected] = useState<FileList | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  // UI/form management
  const [storageConfigured, setStorageConfigured] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const retrieveSasToken = async () => {
      const response: Response = await getSasToken();
      setSasToken(response.Token);
      setStorageConfigured(isStorageConfigured(response.Token));
    }

    retrieveSasToken();
  }, []);

  const onFileChange = (files: FileList | null) => {
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
    setUploading(true);
    let promises : Promise<string>[] = [];
    const blobsInContainer: string[] = [];
    if(filesSelected !== null)
    {
      for (let index = 0; index < filesSelected!.length; index++) {
        let newPromise: Promise<string> = new Promise((resolve, reject) => {
          uploadFileToBlob(filesSelected![index], sasToken, setProgress);
          resolve('Correctly resolved');
        });
        promises.push(newPromise); 
      }

      Promise.allSettled(promises)
        .then((values) => {
          console.log("VALUES", values);
        }
      );
    }

    setBlobList(blobsInContainer);

    setFilesSelected(null);
    setInputKey(Math.random().toString(36));
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
            inputKey={inputKey} onFileChange={onFileChange} onFileUpload={onFileUpload}/>}
        </Col>
      </Row>
      <Row>
        <Col>
          <br/>
          {uploading && <ProgressBar animated now={progress} label={`${progress}%`} />}
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


