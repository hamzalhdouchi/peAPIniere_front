import React from "react";
import { Helmet } from "react-helmet";

export default function Header() {
  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PéAPInière - Administration</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"/>
         <script src="https://cdn.tailwindcss.com"></script>
      </Helmet>
      
    </>
  );
}
