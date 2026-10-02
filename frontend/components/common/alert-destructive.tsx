import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDestructive() {
  const alert = (
    <div>
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          A user is already registered with this phone number
          <a href="/">
            <p>Back to home page</p>
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
  return alert;
}
