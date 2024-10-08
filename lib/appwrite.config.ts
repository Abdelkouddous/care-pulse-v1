import * as sdk from "node-appwrite";

// import {Client , Account , ID} from 'appwrite';

export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  ADMIN_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

// const client = new sdk.Client();

const admin = new sdk.Client();
// client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);
admin.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

const client = new sdk.Client()
  .setEndpoint(ENDPOINT!)
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!);

const account = new sdk.Account(client);

export const databases = new sdk.Databases(client);
// export const databases = new sdk.Databases(appointment);
export const users = new sdk.Users(client);
export const admins = new sdk.Users(admin);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
