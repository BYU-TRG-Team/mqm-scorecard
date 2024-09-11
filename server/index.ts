import express, { Request, Response } from "express";
import cors from "cors";
// @ts-ignore
import { constructApp } from "../../api/dist/app";
import path from "path";

let port: any;
const app = constructApp();

app.use(cors()); // Add this line
app.use(express.static(path.join(__dirname, '../../build')));
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

if (process.env.APP_ENV === 'development') {
  port = 8081;
} else {
  port = process.env.PORT || 3000;
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});