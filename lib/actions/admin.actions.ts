"use server";
import { Query } from "node-appwrite";

// import { admins } from "../appwrite.config";
// Server side
import {
  DATABASE_ID,
  ADMIN_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const getAdmin = async (adminId: string) => {
  console.log("Fetching admin with ID:", adminId); // Log the input adminId
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      ADMIN_COLLECTION_ID!,
      [Query.equal("adminId", [adminId])]
    );

    console.log("Documents found:", patients.documents.length); // Log how many documents were found

    if (patients.documents.length > 0) {
      console.log("Retrieved documents:", patients.documents); // Log retrieved documents
      return parseStringify(patients.documents[0]);
    } else {
      console.log("No admin found for ID:", adminId); // Log if no admin is found
      return null; // Return null if no admin found
    }
  } catch (err) {
    console.error("Error fetching admin:", err); // Log any errors
    return null; // Always return null if there's an error
  }
};

// 66feedc6002cfce162d2

// 66feedc6002cfce162d2
