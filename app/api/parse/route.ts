import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
export async function POST(req: NextRequest){
  const fromData = await req.formData();
  console.log(fromData);
 // parse the pdf file
  const file = fromData.get('file') as File;
  if (!file) {
    return NextResponse.json({
      error: "No file provided"
    }, { status: 400 });
  } 
  const buffer = await file.arrayBuffer();
  const pdfBuffer = Buffer.from(buffer);
  let parsedData = await pdfParse(pdfBuffer);
  console.log(parsedData.text);
  

  


  return NextResponse.json({
    message: "File received"
  });
}