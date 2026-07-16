import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

async function test() {
  const urlParam = "https://agrolide-biblio.384a52e5c7736534216323423c852a8b.r2.cloudflarestorage.com/evenements/presentations/4256affa-4d19-487a-bc7b-05de3c62c761.pdf";
  const urlObj = new URL(urlParam);
  const objectKey = decodeURIComponent(urlObj.pathname.substring(1));
  const bucketName = urlObj.hostname.split('.')[0];

  console.log("Bucket:", bucketName);
  console.log("Key:", objectKey);

  const command = new GetObjectCommand({
    Bucket: bucketName || process.env.R2_BUCKET_NAME,
    Key: objectKey,
    ResponseContentDisposition: 'inline'
  });
  
  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log("Signed URL generated:", signedUrl);
    
    // Now try fetching the signed url
    const res = await fetch(signedUrl);
    console.log("Fetch status:", res.status);
    console.log("Content-Type:", res.headers.get('content-type'));
  } catch(e) {
    console.error(e);
  }
}

test();
