import React from "react";

const Documentation = () => {
  return (
    <div>
      <h1 className="text-h2">Documentation</h1>

      <p className="my-5 text-lg">
        The project is designed to provide developers with an easy and secure
        way to upload files by running the file server locally. This approach
        ensures complete control over the server, eliminating the need to
        connect to external projects or share sensitive credentials with third
        parties.
      </p>
      <p className="my-5 text-lg">
        Follow the steps below to properly use the application. If you have any
        questions, please contact support.
      </p>

      <SubHeading>1. Server Configuration</SubHeading>
      <CodeBlock>
        {`
# .env file example
CLIENT_URL=http://localhost:3000
PORT=5000
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
        `}
      </CodeBlock>
      <div className="my-5 text-lg">
        In the server&apos;s `.env` file, you need to configure the following:
        <ul className="list-disc list-inside">
          <li>
            <strong>CLIENT_URL:</strong> This should point to the frontend
            application URL (e.g., <code>http://localhost:3000</code>).
          </li>
          <li>
            <strong>PORT:</strong> Specify the port on which the server will
            run. The default is <code>5000</code>, but you can change it as
            needed.
          </li>
          <li>
            <strong>DATABASE_URL:</strong> Add the database connection string.
          </li>
          <li>
            <strong>JWT_SECRET:</strong> Provide a secret key for generating JWT
            tokens.
          </li>
        </ul>
      </div>

      <SubHeading>2. Running the Next.js Application</SubHeading>
      <p className="my-5 text-lg">
        Ensure that the Next.js application is running on the same port as
        specified in <code>CLIENT_URL</code> in the server&apos;s `.env` file.
        Typically, this will be <code>http://localhost:3000</code>.
      </p>

      <SubHeading>3. File Upload API</SubHeading>
      <p className="my-5 text-lg">
        To upload files, send a POST request to the following URL:
      </p>
      <CodeBlock>
        {`
POST http://localhost:5000/api/files/upload/
Headers: {
  "Authorization": "Bearer <your_token>",
}
Form Data: {
  "file": <your_file>,
}
        `}
      </CodeBlock>
      <div className="my-5 text-lg">
        <strong>Important Notes:</strong>
        <ul className="list-disc list-inside">
          <li>
            The key name for the file in the form data must be <code>file</code>
            .
          </li>
          <li>
            Maximum file size is <strong>100 MB</strong>.
          </li>
          <li>
            Allowed file extensions are:
            <CodeBlock>
              {`
const ALLOWED_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx", ".mp4", ".mov", ".avi", ".mkv", ".webm", ".ppt", ".pptx", ".xls", ".xlsx", ".csv"
];
              `}
            </CodeBlock>
          </li>
        </ul>
      </div>

      <SubHeading>4. Customization</SubHeading>
      <p className="my-5 text-lg">
        You are free to modify the system as needed. For example, you can update
        the file upload logic in the <code>fileController</code> to suit your
        requirements.
      </p>
      <CodeBlock>
        {`
// Example: Customizing fileController
function uploadFile(req, res) {
  const { file } = req;
  if (!file) {
    return res.status(400).send("File is required");
  }
  // Add your custom logic here
}
        `}
      </CodeBlock>
    </div>
  );
};

export default Documentation;

function SubHeading({ children }: { children: string }) {
  return <h1 className="text-h3 mt-8 mb-4">{children}</h1>;
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white p-6 rounded-lg w-full mt-5 font-mono">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 text-red-500">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="mt-4 whitespace-pre-wrap">{children}</div>
    </div>
  );
}
