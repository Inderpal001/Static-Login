import React from 'react';
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from '@remix-run/react';
import { getSession, destroySession } from "../../session"
import styles from "../../styles/home.css?url";

export const meta = () => {
  return [
    { title: "Home | Remix" },
    {
      name: "description",
      content: "This is Home Page",
    },
  ];
};

export const links = () => [
  { rel: "stylesheet", href: styles },
];

export const loader = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=50");
  const data = await response.json();
  return json({ todos: data });
}

export default function Index() {

  const { todos } = useLoaderData();

  return (
    <div className='home-container'>
      <div className='back-button-container'>
        <Form method="post">
          <button className='logout-button'>Logout</button>
        </Form>
      </div>
      <h1 className='todos-heading'>Todos</h1>
      <div className='todos-container'>
        {
          todos.map((todo, index) => {
            return <div key={index} className='todos'>
              <h1 className='todo-title'>{todo.title}</h1>
            </div>
          })
        }
      </div>
    </div>
  )
}


export const action = async ({
  request,
}) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  console.log(session);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};