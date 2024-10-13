import { Client, Account, ID } from "appwrite";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("<PROJECT_ID>"); // Replace with your Appwrite project ID

const account = new Account(client);

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Phone Login",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        code: { label: "Verification Code", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          // Step 1: Send a verification code if `code` is not provided
          if (!credentials?.code) {
            await account.createPhoneToken(
              ID.unique(),
              credentials!.phoneNumber
            );
            return null; // Trigger only sending of code
          }

          // Step 2: Verify the code sent to the user's phone number
          const session = await account.updatePhoneSession(
            credentials.phoneNumber,
            credentials.code
          );

          // Step 3: Return the user session if authentication is successful
          return {
            id: session.userId,
            name: session.userId,
          };
        } catch (error) {
          console.error("Appwrite Auth error:", error);
          return null; // Authentication failed
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token; // Add user info to session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin", // Set to your custom sign-in page
  },
});
