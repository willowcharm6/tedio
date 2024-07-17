/**
 * v0 by Vercel.
 * @see https://v0.dev/t/tegg21IGR6Q
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Input from "../../components/input.jsx";
import Button from "../../components/button.jsx";


export default function Component() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/path-to-background-image.jpg)" }}
    >
      <div className="w-full max-w-md p-6 bg-[#f5d142] rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <Tally3Icon className="w-8 h-8 mr-2" />
          <h1 className="text-xl font-bold">Tedio</h1>
        </div>
        <h2 className="mb-2 text-2xl font-bold">Welcome to Tedio</h2>
        <p className="mb-6 text-sm text-muted-foreground">Create value-aligned algorithm for kids</p>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input id="email" type="email" placeholder="Email" className="w-full" />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input id="password" type="password" placeholder="Create a password" className="w-full" />
          </div>
          <Button type="submit" className="w-full bg-[#2a2a2a] text-white">
            Continue
          </Button>
        </form>
        <div className="my-4 text-center text-muted-foreground">OR</div>
        <Button variant="outline" className="w-full">
          <ChromeIcon className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>
        <p className="mt-6 text-xs text-center text-muted-foreground">
          By continuing, you agree to Pinterest's{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and acknowledge you've read our{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>{" "}
          <a href="#" className="underline">
            Notice at collection
          </a>
        </p>
        <p className="mt-4 text-center text-muted-foreground">
          Already a member?{" "}
          <a href="#" className="underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}

function ChromeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}


function Tally3Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4v16" />
      <path d="M9 4v16" />
      <path d="M14 4v16" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}