import { type NextApiRequest, type NextApiResponse } from "next";
import { Webhook } from "svix";
import { UserJSON, type WebhookEvent } from "@clerk/nextjs/server";
import { env } from "~/env";
import getRawBody from "raw-body";
import { userRepository } from "~/server/api/repositories";
import { User } from "~/server/api/models/user";
import { userService } from "~/server/api/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the raw body as a buffer
    const rawBody = await getRawBody(req);
    const payload = rawBody.toString();

    // Get the headers
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: "Missing svix headers" });
    }

    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
    let event: WebhookEvent;

    try {
      event = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (error: unknown) {
      const err = error as Error;
      console.log("Error verifying webhook:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    switch (event.type) {
      case "user.created":
        const response = await handleUserCreated(event);
        return res.status(response.status).end();
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return res.status(200).end();
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export const handleUserCreated = async (event: WebhookEvent) => {
    const {
      first_name: firstName,
      last_name: lastName,
      email_addresses,
      id: clerkId,
    } = event.data as UserJSON;
    const email = email_addresses[0]?.email_address;
  
    if (!email) return { status: 400 };
  
  
    try {
      await userService.register(
        clerkId, firstName, lastName, email
      )
      return { status: 200 };
    } catch (error) {
      console.error("Error saving new user:", error);
      return { status: 500 };
    }
  };