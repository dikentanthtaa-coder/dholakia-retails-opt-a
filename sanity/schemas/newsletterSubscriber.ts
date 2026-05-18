import { defineField, defineType } from "sanity";

/**
 * Newsletter subscriber — stored as a document.
 * Created server-side via /api/newsletter; not user-editable from the form
 * but editors can mark a subscriber as Unsubscribed / Bounced from Studio.
 *
 * Email is normalised (trim + lowercase) by the API before storage so the
 * dedup query (`email == $email`) is exact.
 */
export default defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (r) =>
        r
          .required()
          .max(180)
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            name: "email",
            invert: false,
          }),
    }),
    defineField({
      name: "source",
      title: "Source page / component",
      type: "string",
      description:
        "Where the subscription was initiated (e.g. /news, footer).",
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed at",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Unsubscribed", value: "unsubscribed" },
          { title: "Bounced", value: "bounced" },
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
  ],
  orderings: [
    {
      title: "Subscribed, newest first",
      name: "subscribedAtDesc",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
    {
      title: "Email, A → Z",
      name: "emailAsc",
      by: [{ field: "email", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "source",
      date: "subscribedAt",
      status: "status",
    },
    prepare({ title, subtitle, date, status }) {
      const d = date
        ? new Date(date as string).toLocaleString()
        : "";
      return {
        title: title as string,
        subtitle: [status, subtitle, d].filter(Boolean).join(" · "),
      };
    },
  },
});
