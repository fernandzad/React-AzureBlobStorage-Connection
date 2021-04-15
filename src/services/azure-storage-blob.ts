import { TransferProgressEvent } from '@azure/core-http';
import { BlobServiceClient, BlockBlobParallelUploadOptions, ContainerClient } from '@azure/storage-blob';

const containerName = process.env.REACT_APP_BLOB_CONTAINER_NAME || "bc-durablefunction-poc";
const storageAccountName = process.env.REACT_APP_STORAGE_ACCOUNT || "sadurablefunctionpoc";

export const isStorageConfigured = (sasToken: string) => {
  return (!storageAccountName || !sasToken) ? false : true;
}

const getBlobsInContainer = async (containerClient: ContainerClient) => {
  const returnedBlobUrls: string[] = [];

  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
}

const createBlobInContainer = async (containerClient: ContainerClient, file: File, setProgress: any) => {
  const { name, size } = file;
  const blobClient = containerClient.getBlockBlobClient(file.name);

  const options: BlockBlobParallelUploadOptions = { 
    blobHTTPHeaders: { 
      blobContentType: file.type 
    }, 
    onProgress: (transfer: TransferProgressEvent) => {
      const { loadedBytes } = transfer;
      const progress = parseInt(((loadedBytes / size) * 100).toString(), 10);
      setProgress(progress);
      return console.log(`File: ${name}, progress: ${progress}`);
    }
  };
  
  try {
    await blobClient.uploadData(file, options);
  } catch(ex) {
    console.log('SAS Token has expired', ex);
  }
}

const uploadFileToBlob = async (file: File | null, sasToken: string, setProgress: any): Promise<string[]> => {
  if (!file) return [];

  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  const containerClient: ContainerClient = blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: 'container',
  });

  await createBlobInContainer(containerClient, file, setProgress);

  return getBlobsInContainer(containerClient);
};

export default uploadFileToBlob;
