import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { firebaseApp, firebaseConfig } from "@/src/shared/config/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { initializeApp } from "firebase/app";
//const app = initializeApp(firebaseConfig);
//const auth = initializeAuth(app, { persistence: indexedDBLocalPersistence });

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  //console.log(auth);
  console.log("params: ", params);
  return new Response("hello world");
}
