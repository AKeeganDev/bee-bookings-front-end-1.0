import React, { useState } from 'react';
import AWS from 'aws-sdk';

const S3_BUCKET = 'bee-bucket-microverse';
const REGION = 'us-east-1';

AWS.config.update({
  accessKeyId: 'AKIATPPJB3KR6KYQHK4P',
  secretAccessKey: '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',
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const UploadImage = ({ selectedFile, setSelectedFile }) => {
  const [progress, setProgress] = useState(0);

  const handleFileInput = (e) => {
    if (e.target.files[0].type.includes('image')) {
      alert('Please select an image file');
    } else if (e.target.files[0].size > 11_000_000) {
      alert('File is too big');
    } else {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = (file) => {
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    myBucket
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => err);
  };

  return (
    <div>
      <div>
        File Upload Progress is
        {progress}
      </div>
      <input type="file" onChange={handleFileInput} />
      <button type="button" onClick={() => uploadFile(selectedFile)}>
        {' '}
        Upload to S3
      </button>
      <img
        src="https://bee-bucket-microverse.s3.amazonaws.com/download.jpg"
        alt=""
      />
    </div>
  );
};

export default UploadImage;
