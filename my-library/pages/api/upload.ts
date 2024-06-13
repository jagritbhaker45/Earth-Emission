
// import { NextApiRequest, NextApiResponse } from 'next';
// import formidable from 'formidable';
// import fs from 'fs';
// import xlsx from 'xlsx'; // Import xlsx for Excel file parsing
// // import prisma  from '../../lib/prisma'; // Import Prisma and Prisma type definitions
// import { Prisma, PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();


// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const form = new formidable.IncomingForm({ uploadDir: './tmp' });

//     form.parse(req, async (err, fields, files: any) => { // Asserting files as any
//         if (err) {
//             return res.status(500).json({ error: 'Error parsing form data' });
//         }

//         if (!files || !files.files) {
//             return res.status(400).json({ error: 'No files uploaded' });
//         }

//         try {
//             const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];
//             for (const uploadedFile of uploadedFiles) {
//                 const tempFilePath = uploadedFile.path || '';
//                 const fileName = uploadedFile.name || '';
//                 const newFilePath = `./tmp/${fileName}`;
                
//                 fs.renameSync(tempFilePath, newFilePath);

//                 const workbook = xlsx.readFile(newFilePath);
//                 const sheetName = workbook.SheetNames[0]; // Assuming only one sheet
//                 const worksheet = workbook.Sheets[sheetName];
//                 const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//                 // Assuming first row contains headers
//                 const headers = data[0] as string[];

//                 const parsedData = data.slice(1).map((row: any) => {
//                     const rowData: Record<string, any> = {};
//                     headers.forEach((header: string, index: number) => {
//                       rowData[header] = row[index];
//                   });
//                   return rowData;
//                 });

//                 for (const rowData of parsedData) {
//                     try {
//                         // Create an object with field names matching Prisma model
//                         const prismaData: Prisma.customer_tCreateInput = {
//                             image: rowData.image || '',
//                             name: rowData.name || '',
//                             email: rowData.email || '',
//                             location: rowData.location || '',
//                             orders: rowData.orders || 0,
//                             lastOrder: rowData.lastOrder || '',
//                             spent: rowData.spent || '',
//                             refunds: rowData.refunds || undefined, // If refunds is optional
//                             fav: rowData.fav || '',
//                         };

//                         // Create entry in the database using Prisma
//                         await prisma.customer_t.create({
//                             data: prismaData,
//                         });
//                     } catch (error) {
//                         console.error('Error creating entry in database:', error);
//                     }
//                 }

//                 fs.unlinkSync(newFilePath);
//             }

//             res.status(200).json({ message: 'Bulk import successful' });
//         } catch (error) {
//             console.error('Error processing files:', error);
//             res.status(500).json({ error: 'Error processing files' });
//         }
//     });
// }


// 

// 


import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

// Utility function to parse formidable files
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields, files: formidable.Files }> => {
    const form = new formidable.IncomingForm({ uploadDir: './tmp' });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { files } = await parseForm(req);

        if (!files || !files.files) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];
        for (const uploadedFile of uploadedFiles) {
            const file = uploadedFile as File;
            const tempFilePath = file.filepath;
            const fileName = file.originalFilename || '';
            const newFilePath = `./tmp/${fileName}`;

            // Move file to new path
            fs.renameSync(tempFilePath, newFilePath);

            // Read the Excel file
            const workbook = xlsx.readFile(newFilePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

            // Parse data
            const headers = data[0] as string[];
            const parsedData = data.slice(1).map((row) => {
                const rowData: Record<string, any> = {};
                (row as any[]).forEach((value, index) => {
                    rowData[headers[index]] = value;
                });
                return rowData;
            });

            // Insert parsed data into the database
            for (const rowData of parsedData) {
                try {
                    const prismaData = {
                        image: rowData.image || '',
                        name: rowData.name || '',
                        email: rowData.email || '',
                        location: rowData.location || '',
                        orders: rowData.orders || 0,
                        lastOrder: rowData.lastOrder || '',
                        spent: rowData.spent || '',
                        refunds: rowData.refunds || undefined,
                        fav: rowData.fav || '',
                    };

                    await prisma.customer_t.create({
                        data: prismaData,
                    });
                } catch (error) {
                    console.error('Error creating entry in database:', error);
                }
            }

            // Remove the temp file
            fs.unlinkSync(newFilePath);
        }

        res.status(200).json({ message: 'Bulk import successful' });
    } catch (error) {
        console.error('Error processing files:', error);
        res.status(500).json({ error: 'Error processing files' });
    }
}
