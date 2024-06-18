import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { getSession, commitSession } from "../session";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In | Remix" },
    {
      name: "description",
      content: "This is Sign In Page",
    },
  ];
};

type Errors = {
  username?: string;
  email?: string;
  password?: string;
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-100">
      <Form
        method="post"
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[400px] h-auto"
      >
        <div className="mb-2 flex justify-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTARbrbtvhEVRMoShS4SHZ52tbRzuF-GSAo-w&s"
            alt=""
            width="50px"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            name="username"
          />
          {actionData?.errors?.username ? (
            <em>{actionData.errors.username}</em>
          ) : null}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            E-Mail
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="off"
            name="email"
          />
          {actionData?.errors?.email ? (
            <em>{actionData.errors.email}</em>
          ) : null}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            name="password"
          />
          {actionData?.errors?.password ? (
            <em>{actionData.errors.password}</em>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign in
          </button>

          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Already have an Account
          </Link>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const username = String(formData.get("username"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const adminUserName = "Inderpal";
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123456";

  const errors: Errors = {};

  if (username.length <= 0) {
    errors.username = "Username can't be empty";
  }

  if (!email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (password.length < 8) {
    errors.password = "Password should be at least 8 characters";
  }

  if (
    username !== adminUserName ||
    email !== adminEmail ||
    password !== adminPassword
  ) {
    errors.username = "Invalid username";
    errors.email = "Invalid email";
    errors.password = "Invalid password";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  session.set("userId", email);

  session.flash("error", null);

  return redirect("/home", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
