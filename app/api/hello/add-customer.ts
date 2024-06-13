// This code essentially creates an API route that accepts file uploads (CSV or Excel), parses the uploaded file, and inserts the data into a database using Prisma.
// handling the backend logic for handling the POST request to add a new customer to your database.
// import { NextApiRequest, NextApiResponse } from 'next';
// import formidable, { File } from 'formidable';
// import { parse } from 'csv-parse';


// import { PrismaClient } from '@prisma/client';
// import xlsx from 'xlsx';
// import fs from 'fs';

// const prisma = new PrismaClient();

// // Disable body parsing by Next.js to handle it manually with formidable
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     const form = formidable({ multiples: false });

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Error parsing the file' });
//       }

//       const file = files.file;
//       let filePath: string | undefined;
//       let fileName: string | undefined;

//       if (Array.isArray(file)) {
//         // If multiple files were uploaded (though we expect only one), take the first one
//         filePath = file[0].filepath;
//         fileName = file[0].originalFilename ?? undefined;
//       } else if (file) {
//         filePath = (file as File).filepath;
//         fileName = (file as File).originalFilename ?? undefined;
//       } else {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }
      

//       try {
//         const data = await parseFile(filePath, fileName) as any[];
//         await insertDataIntoDatabase(data);
//         res.status(200).json({ message: 'File processed successfully' });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error processing the file' });
//       } finally {
//         // Clean up the uploaded file
//         if (filePath) {
//           fs.unlinkSync(filePath);
//         }
//       }
//     });
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// };

// const parseFile = (filePath: string, fileName: string | undefined): Promise<any[]> => {
//   return new Promise((resolve, reject) => {
//     if (fileName?.endsWith('.csv')) {
//       const results: any[] = [];
//       fs.createReadStream(filePath)
//         .pipe(parse({ columns: true }))
//         .on('data', (row) => results.push(row))
//         .on('end', () => resolve(results))
//         .on('error', (error) => reject(error));
//     } else if (fileName?.endsWith('.xlsx')) {
//       const workbook = xlsx.readFile(filePath);
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = xlsx.utils.sheet_to_json(worksheet);
//       resolve(jsonData as any[]); // Cast to any[] since TypeScript cannot infer the type
//     } else {
//       reject(new Error('Unsupported file format'));
//     }
//   });
// };

// const insertDataIntoDatabase = async (data: any[]) => {
//   for (const item of data) {
//     // Exclude the 'id' property from the data object
//     const { id, ...dataWithoutId } = item;
//     await prisma.customer_t.create({
//       data: {
//         ...dataWithoutId,
//         orders: parseInt(item.orders, 10),
//         refunds: item.refunds ? parseInt(item.refunds, 10) : null,
//       },
//     });
//   }
// };


// export default handler;

// import { NextApiRequest, NextApiResponse } from 'next';
// import formidable, { File } from 'formidable';
// import { parse } from 'csv-parse';
// import { PrismaClient } from '@prisma/client';
// import xlsx from 'xlsx';
// import fs from 'fs';

// const prisma = new PrismaClient();

// // Disable body parsing by Next.js to handle it manually with formidable
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     const form = formidable({ multiples: false });

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error('Error parsing the form:', err);
//         return res.status(500).json({ error: 'Error parsing the file' });
//       }

//       const file = files.file;
//       let filePath: string | undefined;
//       let fileName: string | undefined;

//       if (Array.isArray(file)) {
//         // If multiple files were uploaded (though we expect only one), take the first one
//         filePath = file[0].filepath;
//         fileName = file[0].originalFilename ?? undefined;
//       } else if (file) {
//         filePath = (file as File).filepath;
//         fileName = (file as File).originalFilename ?? undefined;
//       } else {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }

//       try {
//         const data = await parseFile(filePath, fileName);
//         await insertDataIntoDatabase(data);
//         res.status(200).json({ message: 'File processed successfully' });
//       } catch (error) {
//         console.error('Error processing the file:', error);
//         res.status(500).json({ error: 'Error processing the file' });
//       } finally {
//         // Clean up the uploaded file
//         if (filePath) {
//           fs.unlinkSync(filePath);
//         }
//       }
//     });
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// };

// const parseFile = (filePath: string, fileName: string | undefined): Promise<any[]> => {
//   return new Promise((resolve, reject) => {
//     if (fileName?.endsWith('.csv')) {
//       const results: any[] = [];
//       fs.createReadStream(filePath)
//         .pipe(parse({ columns: true }))
//         .on('data', (row) => results.push(row))
//         .on('end', () => resolve(results))
//         .on('error', (error) => reject(error));
//     } else if (fileName?.endsWith('.xlsx')) {
//       const workbook = xlsx.readFile(filePath);
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = xlsx.utils.sheet_to_json(worksheet);
//       resolve(jsonData as any[]);
//     } else {
//       reject(new Error('Unsupported file format'));
//     }
//   });
// };

// const insertDataIntoDatabase = async (data: any[]) => {
//   for (const item of data) {
//     const { id, ...dataWithoutId } = item;
//     await prisma.customer_t.create({
//       data: {
//         ...dataWithoutId,
//         orders: parseInt(item.orders, 10),
//         refunds: item.refunds ? parseInt(item.refunds, 10) : null,
//       },
//     });
//   }
// };

// export default handler;


import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files, File as FormidableFile } from 'formidable';
import parse from 'csv-parse';
import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';
import fs from 'fs';

const prisma = new PrismaClient();

type File = {
  filepath: string;
  originalFilename?: string;
};

type FileData = {
  id: string;
  // Add other fields here
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; error?: string }>
) => {
  if (req.method === 'POST') {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields: Fields, files: Files) => {
      if (err) {
        console.error('Error parsing the form:', err);
        return res.status(500).json({ message: 'Error parsing the file', error: 'Error parsing the file' });
      }

      const file = files.file;
      let filePath: string | undefined;
      let fileName: string | undefined;

      if (Array.isArray(file)) {
        // If multiple files were uploaded (though we expect only one), take the first one
        filePath = file[0].filepath;
        fileName = file[0].originalFilename?? undefined;
      } else if (file) {
        filePath = (file as FormidableFile).filepath;
        fileName = (file as FormidableFile).originalFilename?? undefined;
      } else {
        return res.status(400).json({ message: 'No file uploaded', error: 'No file uploaded' });
      }

      //... rest of the code
    });
  } else {
    res.status(405).json({ message: 'Method not allowed', error: 'Method not allowed' });
  }
};

export default handler;