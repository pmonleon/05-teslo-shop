import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { CredentialInput } from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Custom Login",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
          placeholder: "correo@google.com",
        },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      //@ts-ignore
      async authorize(credentials) {
        // console.log({ credentials });
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        // validar contra base de datos
        return await dbUsers.checkUserEmailPassword(email, password);
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  // Custom pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  // Callbacks
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, maxAge: '1d
  },
  session: {
    maxAge: 2592000, // 30 dias
    strategy: "jwt",
    updateAge: 86400, // cada dia
  },
  callbacks: {
    //@ts-ignore
    async session({ session, user, token }) {
      // console.log("session data", user, token);
      session.accessToken = token.accessToken;
      session.user = token.user;

      return session;
    },
    //@ts-ignore
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("jwt", { token, account, user, profile, isNewUser });
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case "credentials":
            token.user = user;
            break;
          case "oauth":
            // crear user o verificar si existe
            await dbUsers.oAuthToDbUser(user?.email || "", user?.name || "");
            break;
          default:
            break;
        }
      }

      return token;
    },
  },
};

//@ts-ignore
export default NextAuth(authOptions);
