import { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
const http = httpRouter();

http.route({
        path: "/clerk-webhook",
        method: "POST",
        handler: httpAction(async (ctx, req) => {
                const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
                if (!webhookSecret) {
                        throw new Error("MISSING CLERK_WEBHOOK_SECRET environment variable");
                }

                const svix_id = req.headers.get("svix-id");
                const svix_signature = req.headers.get("svix-signature");
                const svix_timestamp = req.headers.get("svix-timestamp");

                if (!svix_id || !svix_signature || !svix_timestamp) {
                        return new Response("Missing SVIX headers", { status: 400 });
                }

                const payload = await req.json();
                const body = JSON.stringify(payload);

                const webhookInstance = new Webhook(webhookSecret);
                let evt: WebhookEvent;

                try {
                        evt = webhookInstance.verify(body, {
                                "svix-id": svix_id,
                                "svix-signature": svix_signature,
                                "svix-timestamp": svix_timestamp,
                        }) as WebhookEvent;
                } catch (error: unknown) {
                        console.error(error);
                        return new Response("Invalid SVIX payload", { status: 400 });
                }

                const eventType = evt.type;
                if (eventType === "user.created" || eventType === "user.updated") {
                        const { id, email_addresses, image_url, first_name, last_name } = evt.data;
                        const email = email_addresses[0].email_address;
                        const name = `${first_name} ${last_name}`.trim();

                        try {
                                await ctx.runMutation(api.users.upsertUser, {
                                        email,
                                        name,
                                        image: image_url,
                                        role: eventType === "user.created" ? "candidate" : "interviewer",
                                        clerkId: id,
                                });
                        } catch (error: unknown) {
                                console.error(error);
                                return new Response("Failed to upsert user", { status: 500 });
                        }
                } else if (eventType === "user.deleted") {
                        // Handle user deletion if needed
                        // You may want to add a delete mutation here
                }

                return new Response("WEBHOOK Processed successfully", { status: 200 });
        }),
});

export default http;
